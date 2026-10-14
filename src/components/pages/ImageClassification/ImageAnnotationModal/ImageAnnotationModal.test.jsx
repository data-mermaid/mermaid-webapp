import { afterEach, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'

import React from 'react'
import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'
import { toast } from 'react-toastify'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import ImageAnnotationModal from './ImageAnnotationModal'
import { RETRY_DELAYS_MS } from './useAnnotationSaveQueue'
import { HttpResponseErrorHandlerProvider } from '../../../../App/HttpResponseErrorHandlerContext'
import handleHttpResponseError from '../../../../library/handleHttpResponseError'

// The map needs more of maplibre than the shared mock provides, and these tests only cover saving.
// Its text marks where the review content renders.
vi.mock('./ImageAnnotationModalMap', () => ({ default: () => 'annotation map' }))

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const annotationsUrl = `${apiBaseUrl}/projects/5/classification/images/fake-image-id/`

const fakeBenthicAttribute = { id: 'fake-benthic-attribute-id', name: 'Fake coral' }

// One point with an unconfirmed classifier guess, so its table row has a Confirm all button
const annotationsResponse = {
  original_image_name: 'fake-image.jpg',
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  points: [
    {
      id: 'fake-point-id',
      row: 400,
      column: 500,
      annotations: [
        {
          id: 'fake-annotation-id',
          benthic_attribute: fakeBenthicAttribute.id,
          growth_form: null,
          is_confirmed: false,
          is_machine_created: true,
          score: 90,
        },
      ],
    },
  ],
}

const renderModal = ({
  setImageId = () => {},
  setServerNotReachable = () => {},
  nextImageId,
} = {}) =>
  renderAuthenticatedOnline(
    // The shared render helpers stub the handler out. The real one is what decides whether a
    // failed request switches Collect offline.
    <HttpResponseErrorHandlerProvider
      value={(config) =>
        handleHttpResponseError({ ...config, logoutMermaid: () => {}, setServerNotReachable })
      }
    >
      <Routes>
        <Route
          path="/projects/:projectId/collecting/benthicpqt/:recordId"
          element={
            <ImageAnnotationModal
              imageId="fake-image-id"
              setImageId={setImageId}
              nextImageId={nextImageId}
              benthicAttributes={[fakeBenthicAttribute]}
              growthForms={[]}
              onAnnotationSaveSuccess={() => {}}
            />
          }
        />
      </Routes>
    </HttpResponseErrorHandlerProvider>,
    { initialEntries: ['/projects/5/collecting/benthicpqt/fake-record-id'] },
  )

const mockAnnotationsApi = (patchResolver = () => HttpResponse.json({})) =>
  mockMermaidApiAllSuccessful.use(
    http.get(annotationsUrl, () => HttpResponse.json(annotationsResponse)),
    http.patch(annotationsUrl, patchResolver),
  )

const confirmAllPoints = async (user) =>
  user.click(
    await screen.findByRole('button', { name: 'image_classification.buttons.confirm_all' }),
  )

// The window's X button shares the accessible name, so find the footer button by its text
const getFooterCloseButton = () => screen.getByText('buttons.close', { selector: 'button' })

afterEach(() => {
  vi.useRealTimers()
})

test('Save stays off and reads Saved while there is nothing to save', async () => {
  mockAnnotationsApi()

  renderModal()

  await screen.findByRole('button', { name: 'image_classification.buttons.confirm_all' })

  expect(screen.getByRole('button', { name: 'buttons.saved' })).toBeDisabled()
})

test('Confirming points saves them in the background and keeps the window open', async () => {
  const setImageId = vi.fn()
  let savedPoints

  mockAnnotationsApi(async ({ request }) => {
    ;({ points: savedPoints } = await request.json())

    return HttpResponse.json({})
  })

  const { user } = renderModal({ setImageId })

  await confirmAllPoints(user)

  expect(await screen.findByRole('button', { name: 'buttons.saved' })).toBeDisabled()
  expect(savedPoints).toHaveLength(1)
  expect(savedPoints[0].annotations[0]).toMatchObject({
    id: 'fake-annotation-id',
    is_confirmed: true,
  })
  expect(setImageId).not.toHaveBeenCalled()
})

// Going offline unmounts the window, so a save with no server response must leave Collect online
// for the user to keep their annotations and try again.
test('A background save that keeps failing leaves Collect online and turns Save back on', async () => {
  // Runs the retry waits instantly while still letting real time pass for user events
  vi.useFakeTimers({ shouldAdvanceTime: true })
  // handleHttpResponseError logs the axios error it is handling; keep it out of the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const toastErrorSpy = vi.spyOn(toast, 'error')
  const setServerNotReachable = vi.fn()
  const setImageId = vi.fn()
  let isServerResponding = false

  mockAnnotationsApi(() => (isServerResponding ? HttpResponse.json({}) : HttpResponse.error()))

  const { user } = renderModal({ setImageId, setServerNotReachable })

  await confirmAllPoints(user)
  for (const delay of RETRY_DELAYS_MS) {
    await vi.advanceTimersByTimeAsync(delay)
  }

  const saveButton = await screen.findByRole('button', { name: 'buttons.save_changes' })

  expect(saveButton).toBeEnabled()
  expect(toastErrorSpy.mock.calls.at(-1)?.[0].props.message).toBe(
    'image_classification.errors.save_failed_changes_kept',
  )
  expect(screen.getByText('annotation map')).toBeInTheDocument()
  expect(setServerNotReachable).not.toHaveBeenCalled()
  expect(setImageId).not.toHaveBeenCalled()

  isServerResponding = true
  await user.click(saveButton)

  expect(await screen.findByRole('button', { name: 'buttons.saved' })).toBeDisabled()
  expect(setImageId).not.toHaveBeenCalled()
})

const getNextButton = () =>
  screen.getByRole('button', { name: /image_classification.buttons.next_photo/ })

test('Next stays on the photo when its changes fail to save', async () => {
  // handleHttpResponseError logs the axios error it is handling; keep it out of the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const setImageId = vi.fn()
  let patchRequestCount = 0

  // A 400 isn't retried, so the background save gives up straight away
  mockAnnotationsApi(() => {
    patchRequestCount += 1

    return HttpResponse.json({}, { status: 400 })
  })

  const { user } = renderModal({ setImageId, nextImageId: 'next-image-id' })

  await confirmAllPoints(user)
  await screen.findByRole('button', { name: 'buttons.save_changes' })
  await user.click(getNextButton())

  await waitFor(() => expect(patchRequestCount).toBe(2))
  expect(await screen.findByRole('button', { name: 'buttons.save_changes' })).toBeEnabled()
  expect(setImageId).not.toHaveBeenCalled()
})

test('Close asks before discarding changes that failed to save', async () => {
  // handleHttpResponseError logs the axios error it is handling; keep it out of the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
  const setImageId = vi.fn()

  mockAnnotationsApi(() => HttpResponse.json({}, { status: 400 }))

  const { user } = renderModal({ setImageId })

  await confirmAllPoints(user)
  await screen.findByRole('button', { name: 'buttons.save_changes' })
  await user.click(getFooterCloseButton())

  await waitFor(() => expect(confirmSpy).toHaveBeenCalledTimes(1))
  expect(setImageId).not.toHaveBeenCalled()

  confirmSpy.mockReturnValue(true)
  await user.click(getFooterCloseButton())

  await waitFor(() => expect(setImageId).toHaveBeenCalledTimes(1))
})

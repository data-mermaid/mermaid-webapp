import { expect, test, vi } from 'vitest'
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
import { HttpResponseErrorHandlerProvider } from '../../../../App/HttpResponseErrorHandlerContext'
import handleHttpResponseError from '../../../../library/handleHttpResponseError'

// The map needs more of maplibre than the shared mock provides, and these tests only cover saving.
// Its text marks where the review content renders.
vi.mock('./ImageAnnotationModalMap', () => ({ default: () => 'annotation map' }))

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const annotationsUrl = `${apiBaseUrl}/projects/5/classification/images/fake-image-id/`

const annotationsResponse = {
  original_image_name: 'fake-image.jpg',
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  points: [{ id: 'fake-point-id', row: 400, column: 500, annotations: [] }],
}

const renderModal = ({ setImageId = () => {}, setServerNotReachable = () => {} } = {}) =>
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
              benthicAttributes={[]}
              growthForms={[]}
              onAnnotationSaveSuccess={() => {}}
            />
          }
        />
      </Routes>
    </HttpResponseErrorHandlerProvider>,
    { initialEntries: ['/projects/5/collecting/benthicpqt/fake-record-id'] },
  )

// Saving reads the fetched annotations, so enabling Save early throws and strands the button.
test('Save is disabled until the image annotations have loaded', async () => {
  mockMermaidApiAllSuccessful.use(
    http.get(annotationsUrl, () => HttpResponse.json(annotationsResponse)),
  )

  renderModal()

  // render is synchronous, so this asserts on the first paint, before the fetch can resolve
  const saveButton = screen.getByRole('button', { name: 'buttons.save_changes' })

  expect(saveButton).toBeDisabled()
  await waitFor(() => expect(saveButton).toBeEnabled())
})

// Going offline unmounts the window, so a save with no server response must leave Collect online
// for the user to keep their annotations and try again.
test('A save that gets no server response keeps the window open and Collect online', async () => {
  // handleHttpResponseError logs the axios error it is handling; keep it out of the test output
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const toastErrorSpy = vi.spyOn(toast, 'error')
  const setServerNotReachable = vi.fn()
  const setImageId = vi.fn()

  mockMermaidApiAllSuccessful.use(
    http.get(annotationsUrl, () => HttpResponse.json(annotationsResponse)),
    http.patch(annotationsUrl, () => HttpResponse.error()),
  )

  const { user } = renderModal({ setImageId, setServerNotReachable })

  const saveButton = screen.getByRole('button', { name: 'buttons.save_changes' })

  await waitFor(() => expect(saveButton).toBeEnabled())
  await user.click(saveButton)

  await waitFor(() =>
    expect(toastErrorSpy.mock.calls.at(-1)?.[0].props.message).toContain(
      'image_classification.errors.failed_annotations_save',
    ),
  )
  await waitFor(() => expect(saveButton).toBeEnabled())
  expect(screen.getByText('annotation map')).toBeInTheDocument()
  expect(setServerNotReachable).not.toHaveBeenCalled()
  expect(setImageId).not.toHaveBeenCalled()
})

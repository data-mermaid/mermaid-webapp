import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBenthicPhotoQuadratCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPhotoQuadratCollectRecords'
import { IMAGE_CLASSIFICATION_STATUS } from '../../../../components/pages/ImageClassification/imageClassificationConstants'

// The map needs more of maplibre than the shared mock provides, and these tests don't use it
vi.mock(
  '../../../../components/pages/ImageClassification/ImageAnnotationModal/ImageAnnotationModalMap',
  () => ({ default: () => null }),
)

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const imagesUrl = `${apiBaseUrl}/projects/5/classification/images/`
const deadCoral = 'fcf25ee3-701b-4d15-9a17-71f40406db4c'

const unconfirmedPoint = (id) => ({
  id,
  row: 400,
  column: 500,
  annotations: [
    {
      id: `${id}-annotation`,
      benthic_attribute: deadCoral,
      growth_form: null,
      is_confirmed: false,
      is_machine_created: true,
      score: 90,
    },
  ],
})

const makeImage = ({
  id,
  name,
  createdOn,
  status,
  points = [unconfirmedPoint(`${id}-point`)],
}) => ({
  id,
  created_on: createdOn,
  original_image_name: name,
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  thumbnail: 'thumbnail.jpg',
  classification_status: { status },
  points,
})

const collectRecord = {
  ...mockBenthicPhotoQuadratCollectRecords[0],
  data: {
    ...mockBenthicPhotoQuadratCollectRecords[0].data,
    image_classification: true,
    quadrat_transect: {
      ...mockBenthicPhotoQuadratCollectRecords[0].data.quadrat_transect,
      num_points_per_quadrat: 1,
    },
  },
}

// Serves the photo list, each photo's annotations and saves. Returns a count of list requests.
const mockImageClassificationApi = (images) => {
  const listRequests = { count: 0 }

  mockMermaidApiAllSuccessful.use(
    http.get(imagesUrl, () => {
      listRequests.count += 1

      return HttpResponse.json({ results: images })
    }),
    http.get(`${imagesUrl}:imageId/`, ({ params }) =>
      HttpResponse.json(images.find(({ id }) => id === params.imageId)),
    ),
    // Like the API, a save replies with the whole updated photo
    http.patch(`${imagesUrl}:imageId/`, async ({ params, request }) => {
      const { points: savedPoints } = await request.json()
      const image = images.find(({ id }) => id === params.imageId)

      return HttpResponse.json({
        ...image,
        points: image.points.map((point) => savedPoints.find(({ id }) => id === point.id) ?? point),
      })
    }),
    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecord] },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }),
    ),
  )

  return listRequests
}

const renderRecord = () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  return renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/benthicpqt/90'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )
}

const getPreviousButton = () =>
  screen.getByRole('button', { name: /image_classification.buttons.previous_photo/ })
const getNextButton = () =>
  screen.getByRole('button', { name: /image_classification.buttons.next_photo/ })

test('Previous and Next move through processed photos in table order, skipping ones still processing', async () => {
  mockImageClassificationApi([
    makeImage({
      id: 'first',
      name: 'first.jpg',
      createdOn: '2026-09-01T00:00:00Z',
      status: IMAGE_CLASSIFICATION_STATUS.completed,
    }),
    makeImage({
      id: 'processing',
      name: 'processing.jpg',
      createdOn: '2026-09-02T00:00:00Z',
      status: IMAGE_CLASSIFICATION_STATUS.processing,
      points: [],
    }),
    makeImage({
      id: 'failed',
      name: 'failed.jpg',
      createdOn: '2026-09-03T00:00:00Z',
      status: IMAGE_CLASSIFICATION_STATUS.failed,
      points: [],
    }),
  ])

  const { user } = renderRecord()

  await user.click(await screen.findByTestId('review-photo-first', {}, { timeout: 10000 }))

  expect(await screen.findByRole('heading', { name: 'first.jpg' })).toBeInTheDocument()
  expect(getPreviousButton()).toBeDisabled()

  await user.click(getNextButton())

  expect(await screen.findByRole('heading', { name: 'failed.jpg' })).toBeInTheDocument()
  expect(getNextButton()).toBeDisabled()

  await user.click(getPreviousButton())

  expect(await screen.findByRole('heading', { name: 'first.jpg' })).toBeInTheDocument()
})

// The confirmed and unconfirmed counts follow the attribute label in the photo table's row
const getPhotoTableCounts = (attributeLabel) => {
  const dialog = screen.queryByRole('dialog')
  const row = screen
    .getAllByRole('row')
    .find((tableRow) => !dialog?.contains(tableRow) && within(tableRow).queryByText(attributeLabel))
  const cells = within(row).getAllByRole('cell')
  const labelIndex = cells.findIndex((cell) => cell.textContent === attributeLabel)

  return {
    confirmed: cells[labelIndex + 2].textContent.trim(),
    unconfirmed: cells[labelIndex + 3].textContent.trim(),
  }
}

test('The photo table shows confirmations as each save completes, without reloading the photo list', async () => {
  const listRequests = mockImageClassificationApi([
    makeImage({
      id: 'first',
      name: 'first.jpg',
      createdOn: '2026-09-01T00:00:00Z',
      status: IMAGE_CLASSIFICATION_STATUS.completed,
    }),
  ])

  const { user } = renderRecord()

  await user.click(await screen.findByTestId('review-photo-first', {}, { timeout: 10000 }))
  await screen.findByRole('button', { name: 'image_classification.buttons.confirm_all' })

  expect(getPhotoTableCounts('Dead Coral with Algae')).toEqual({ confirmed: '0', unconfirmed: '1' })

  const listRequestsBeforeSave = listRequests.count

  await user.click(screen.getByRole('button', { name: 'image_classification.buttons.confirm_all' }))
  // The record form has its own Saved button, so look inside the review window
  await within(screen.getByRole('dialog')).findByRole('button', { name: 'buttons.saved' })

  await waitFor(() =>
    expect(getPhotoTableCounts('Dead Coral with Algae')).toEqual({
      confirmed: '1',
      unconfirmed: '0',
    }),
  )

  // The window's X button shares the accessible name, so find the footer button by its text
  await user.click(screen.getByText('buttons.close', { selector: 'button' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

  expect(listRequests.count).toBe(listRequestsBeforeSave)
})

test('The photo table and review window work in browsers without Object.groupBy', async () => {
  // Older browsers, such as HeyTap on Android, don't have Object.groupBy
  vi.spyOn(Object, 'groupBy').mockImplementation(() => {
    throw new TypeError('Object.groupBy is not a function')
  })
  mockImageClassificationApi([
    makeImage({
      id: 'first',
      name: 'first.jpg',
      createdOn: '2026-09-01T00:00:00Z',
      status: IMAGE_CLASSIFICATION_STATUS.completed,
    }),
  ])

  const { user } = renderRecord()

  await user.click(await screen.findByTestId('review-photo-first', {}, { timeout: 10000 }))

  expect(
    await screen.findByRole('button', { name: 'image_classification.buttons.confirm_all' }),
  ).toBeInTheDocument()
  expect(getPhotoTableCounts('Dead Coral with Algae')).toEqual({ confirmed: '0', unconfirmed: '1' })
})

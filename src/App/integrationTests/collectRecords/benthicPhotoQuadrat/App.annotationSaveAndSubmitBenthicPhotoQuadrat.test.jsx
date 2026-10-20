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
const imageId = 'first'
const recordId = mockBenthicPhotoQuadratCollectRecords[0].id

const image = {
  id: imageId,
  created_on: '2026-09-01T00:00:00Z',
  original_image_name: 'first.jpg',
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  thumbnail: 'thumbnail.jpg',
  classification_status: { status: IMAGE_CLASSIFICATION_STATUS.completed },
  points: [
    {
      id: 'first-point',
      row: 400,
      column: 500,
      annotations: [
        {
          id: 'first-point-annotation',
          benthic_attribute: deadCoral,
          growth_form: null,
          is_confirmed: false,
          is_machine_created: true,
          score: 90,
        },
      ],
    },
  ],
}

const baseRecord = {
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

// The server's view of the record as of its last successful Validate
const validatedRecord = { ...baseRecord, validations: { status: 'ok' } }

// What the API's submit re-validation finds once a point is unconfirmed again
const rejectedRecord = {
  ...baseRecord,
  validations: {
    status: 'error',
    results: {
      data: {
        obs_benthic_photo_quadrats: [
          [
            {
              code: 'unconfirmed_annotation',
              status: 'error',
              validation_id: 'unconfirmed',
              context: { group_id: imageId, observation_id: `${imageId}::${deadCoral}::` },
            },
          ],
        ],
      },
    },
  },
}

const pullResponse = (collectRecord) => ({
  benthic_attributes: { updates: mockMermaidData.benthic_attributes },
  choices: { updates: mockMermaidData.choices },
  collect_records: { updates: [collectRecord] },
  project_managements: { updates: mockMermaidData.project_managements },
  project_profiles: { updates: mockMermaidData.project_profiles },
  project_sites: { updates: mockMermaidData.project_sites },
  projects: { updates: mockMermaidData.projects },
})

// Serves the photo, its annotation saves, and the record. `server.record` is what the next pull
// returns, so a test can move the server's record on as the API would.
const mockApi = () => {
  const server = { record: validatedRecord }

  mockMermaidApiAllSuccessful.use(
    http.get(imagesUrl, () => HttpResponse.json({ results: [image] })),
    http.get(`${imagesUrl}:imageId/`, () => HttpResponse.json(image)),
    http.patch(`${imagesUrl}:imageId/`, async ({ request }) => {
      const { points: savedPoints } = await request.json()

      return HttpResponse.json({
        ...image,
        points: image.points.map((point) => savedPoints.find(({ id }) => id === point.id) ?? point),
      })
    }),
    http.post(`${apiBaseUrl}/pull/`, () => HttpResponse.json(pullResponse(server.record))),
  )

  return server
}

const renderRecord = () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  return renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: [`/projects/5/collecting/benthicpqt/${recordId}`] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )
}

test('Saving an annotation in the review window turns Validate back on and Submit off', async () => {
  mockApi()

  const { user } = renderRecord()

  await user.click(await screen.findByTestId('review-photo-first', {}, { timeout: 10000 }))
  await screen.findByRole('button', { name: 'image_classification.buttons.confirm_all' })

  expect(screen.getByTestId('validated-button')).toBeDisabled()
  expect(screen.getByTestId('submit-button')).toBeEnabled()

  await user.click(screen.getByRole('button', { name: 'image_classification.buttons.confirm_all' }))
  // The record form has its own Saved button, so look inside the review window
  await within(screen.getByRole('dialog')).findByRole('button', { name: 'buttons.saved' })

  await user.click(screen.getByText('buttons.close', { selector: 'button' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

  expect(await screen.findByTestId('validate-button')).toBeEnabled()
  expect(screen.getByTestId('submit-button')).toBeDisabled()
})

test('A submission the API rejects shows an error and keeps the record open with its new validations', async () => {
  const server = mockApi()

  mockMermaidApiAllSuccessful.use(
    // Like the API, a rejected submit still replies 200, with the re-validated record
    http.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, () => {
      server.record = rejectedRecord

      return HttpResponse.json({ [recordId]: { status: 'error', record: rejectedRecord } })
    }),
  )

  const { user } = renderRecord()

  await user.click(await screen.findByTestId('submit-button', {}, { timeout: 10000 }))

  expect(await screen.findByText('sample_units.errors.submit_rejected')).toBeInTheDocument()
  expect(screen.queryByText('sample_units.success.record_submitted')).not.toBeInTheDocument()
  expect(screen.queryByTestId('collecting-title')).not.toBeInTheDocument()

  expect(await screen.findByTestId('validate-button')).toBeEnabled()
  expect(screen.getByTestId('submit-button')).toBeDisabled()
})

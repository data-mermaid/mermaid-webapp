import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBenthicPhotoQuadratCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicPhotoQuadratCollectRecords'
import { mockT } from '../../../../testUtilities/mockT'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const imageId = 'image-1'
const deadCoral = 'fcf25ee3-701b-4d15-9a17-71f40406db4c'
const otherAttribute = '77b5acaf-32d0-41fe-acb8-7a0c39f2ae92'

const unconfirmedPoint = (benthicAttribute) => ({
  annotations: [{ benthic_attribute: benthicAttribute, growth_form: null, is_confirmed: false }],
})

// One image, two attribute rows, each still holding unconfirmed points. Image classification
// rows are keyed by the API as imageId::attributeId::growthFormId, not by an observation id.
const image = {
  id: imageId,
  created_on: '2026-09-01T00:00:00Z',
  original_image_name: 'quadrat.jpg',
  thumbnail: '',
  classification_status: { status: 3 },
  points: [unconfirmedPoint(deadCoral), unconfirmedPoint(otherAttribute)],
}

const unconfirmedAnnotationError = (benthicAttribute) => ({
  code: 'unconfirmed_annotation',
  status: 'error',
  validation_id: 'unconfirmed',
  context: { group_id: imageId, observation_id: `${imageId}::${benthicAttribute}::` },
})

const collectRecord = {
  ...mockBenthicPhotoQuadratCollectRecords[0],
  data: {
    ...mockBenthicPhotoQuadratCollectRecords[0].data,
    image_classification: true,
    quadrat_transect: {
      ...mockBenthicPhotoQuadratCollectRecords[0].data.quadrat_transect,
      num_points_per_quadrat: 2,
    },
  },
  validations: {
    status: 'error',
    results: {
      data: {
        obs_benthic_photo_quadrats: [
          [unconfirmedAnnotationError(deadCoral)],
          [unconfirmedAnnotationError(otherAttribute)],
        ],
      },
    },
  },
}

const mockImageClassificationApi = () =>
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/projects/5/classification/images/`, () =>
      HttpResponse.json({ results: [image] }),
    ),
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () =>
      HttpResponse.json({}, { status: 200 }),
    ),
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

test('Image classification rows showing an error are counted and highlighted with Next', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const scrollIntoView = vi
    .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
    .mockImplementation(() => {})

  mockImageClassificationApi()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/benthicpqt/90'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  const rowIds = [deadCoral, otherAttribute].map((attribute) => `${imageId}::${attribute}::`)

  const errorChipCounts = () =>
    mockT.mock.calls
      .filter(([key]) => key === 'sample_units.validation_status.chip_label_error')
      .map(([, options]) => options?.count)

  await waitFor(() => expect(errorChipCounts().at(-1)).toBe(2))

  const nextButton = within(screen.getByTestId('form-status-chip-error')).getByRole('button')

  // jsdom has no layout to order the stops by, so check each row is reached, not the order.
  await user.click(nextButton)

  const firstStop = scrollIntoView.mock.instances.at(-1)

  await waitFor(() => expect(firstStop).toHaveClass('validation-target-highlight'))
  expect(firstStop).toBeInTheDocument()

  await user.click(nextButton)

  const reachedIds = scrollIntoView.mock.instances.map((row) => row.dataset.observationId)

  expect(new Set(reachedIds)).toEqual(new Set(rowIds))
}, 50000)

test('Image classification rows leave the Error chip while the table is replaced by the offline message', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockImageClassificationApi()

  // renderAuthenticatedOnline pins isAppOnline, so the offline toggle would have no effect.
  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
      dexiePerUserDataInstance,
    },
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })

  expect(
    await screen.findByTestId('form-status-chip-error', {}, { timeout: 10000 }),
  ).toBeInTheDocument()

  await user.click(screen.getByTestId('offline-toggle-switch-test'))

  await waitFor(() =>
    expect(screen.queryByTestId('form-status-chip-error')).not.toBeInTheDocument(),
  )

  await user.click(screen.getByTestId('offline-toggle-switch-test'))

  expect(
    await screen.findByTestId('form-status-chip-error', {}, { timeout: 10000 }),
  ).toBeInTheDocument()
}, 50000)

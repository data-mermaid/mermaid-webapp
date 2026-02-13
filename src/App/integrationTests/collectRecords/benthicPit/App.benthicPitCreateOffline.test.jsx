import { describe, expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  within,
  renderAuthenticatedOffline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const saveBenthicPitRecord = async (user) => {
  const siteInput = await screen.findByTestId('site-select')
  const managementRegimeInput = await screen.findByTestId('management-select')
  const depthInput = await screen.findByTestId('depth-input')
  const sampleDateInput = await screen.findByTestId('sample-date-input')
  const sampleTimeInput = await screen.findByTestId('sample-time-input')
  const transectNumberInput = await screen.findByTestId('transect-number-input')
  const labelInput = await screen.findByTestId('label-input')
  const transectLengthInput = await screen.findByTestId('len-surveyed-input')
  const reefSlopeInput = await screen.findByTestId('reef-slope-select')
  const visibilityInput = await screen.findByTestId('visibility-select')
  const currentInput = await screen.findByTestId('current-select')
  const relativeDepthInput = await screen.findByTestId('relative-depth-select')
  const tideInput = await screen.findByTestId('tide-select')
  const notesInput = await screen.findByTestId('notes-textarea')

  await user.selectOptions(siteInput, '1')
  await waitFor(() =>
    expect(within(siteInput).getByRole('option', { name: 'Site A' }).selected).toBe(true),
  )

  await user.selectOptions(managementRegimeInput, '2')
  await waitFor(() =>
    expect(
      within(managementRegimeInput).getByRole('option', {
        name: 'Management Regimes B [Management Regimes 2]',
      }).selected,
    ).toBe(true),
  )

  await user.type(depthInput, '10000')
  expect(depthInput).toHaveValue(10000)

  await user.type(sampleDateInput, '2021-04-21')
  expect(sampleDateInput).toHaveValue('2021-04-21')

  await user.type(sampleTimeInput, '12:34')
  expect(sampleTimeInput).toHaveValue('12:34')

  await user.type(transectNumberInput, '56')
  expect(transectNumberInput).toHaveValue(56)

  await user.type(labelInput, 'some label')
  expect(labelInput).toHaveValue('some label')

  await user.type(transectLengthInput, '2')
  expect(transectLengthInput).toHaveValue(2)

  await user.selectOptions(reefSlopeInput, 'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa')
  await waitFor(() =>
    expect(
      within(reefSlopeInput).getByRole('option', {
        name: 'flat',
      }).selected,
    ).toBe(true),
  )

  await user.selectOptions(visibilityInput, 'a3ba3f14-330d-47ee-9763-bc32d37d03a5')
  await waitFor(() =>
    expect(
      within(visibilityInput).getByRole('option', {
        name: '1-5m - poor',
      }).selected,
    ).toBe(true),
  )

  await user.selectOptions(currentInput, 'e5dcb32c-614d-44ed-8155-5911b7ee774a')
  await waitFor(() =>
    expect(
      within(currentInput).getByRole('option', {
        name: 'high',
      }).selected,
    ).toBe(true),
  )

  await user.selectOptions(relativeDepthInput, '8f381e71-219e-469c-8c13-231b088fb861')
  await waitFor(() =>
    expect(
      within(relativeDepthInput).getByRole('option', {
        name: 'deep',
      }).selected,
    ).toBe(true),
  )

  await user.selectOptions(tideInput, '97a63da7-e98c-4be7-8f13-e95d38aa17ae')
  await waitFor(() =>
    expect(
      within(tideInput).getByRole('option', {
        name: 'falling',
      }).selected,
    ).toBe(true),
  )

  await user.type(notesInput, 'some notes')
  expect(notesInput).toHaveValue('some notes')

  await user.click(await screen.findByTestId('save-button'))
}

describe('Offline', () => {
  test('New Benthic Pit save success shows saved input values, toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthicpit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicPitRecord(user)

    expect(await screen.findByTestId('saved-button'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('record-form-title'))
    // we constrain some queries to the form element because the form title has similar text that will also be selected
    const form = screen.getByRole('form')

    await waitFor(() => {
      expect(screen.getByTestId('site-select')).toHaveDisplayValue('Site A')
      expect(screen.getByTestId('management-select')).toHaveDisplayValue(
        'Management Regimes B [Management Regimes 2]',
      )
      expect(screen.getByTestId('depth-input')).toHaveValue(10000)
      expect(screen.getByTestId('sample-date-input')).toHaveValue('2021-04-21')
      expect(screen.getByTestId('sample-time-input')).toHaveValue('12:34')
      expect(within(form).getByTestId('transect-number-input')).toHaveValue(56)
      expect(within(form).getByTestId('label-input')).toHaveValue('some label')
      expect(screen.getByTestId('len-surveyed-input')).toHaveValue(2)
      expect(screen.getByTestId('reef-slope-select')).toHaveDisplayValue('flat')
      expect(screen.getByTestId('visibility-select')).toHaveDisplayValue('1-5m - poor')
      expect(screen.getByTestId('current-select')).toHaveDisplayValue('high')
      expect(screen.getByTestId('relative-depth-select')).toHaveDisplayValue('deep')
      expect(screen.getByTestId('tide-select')).toHaveDisplayValue('falling')
      expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
    })
  })

  test('New Benthic Pit save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthicpit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicPitRecord(user)

    expect(await screen.findByTestId('saved-button'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-collecting'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => within(pageSizeSelector).getByText('22'))
    await user.selectOptions(pageSizeSelector, '22')
    const table = await screen.findByRole('table')

    const linksToBenthicPitRecords = within(table).getAllByRole('link', { name: 'protocol_titles.benthicpit' })

    expect(linksToBenthicPitRecords).toHaveLength(2)

    // expect unique depth as proxy for New Benthic Pit
    expect(await within(table).findByText('10000'))
  })

  test('New Benthic Pit save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthicpit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicPitRecord(user)

    expect(await screen.findByTestId('save-button'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(screen.getByTestId('benthicpit-page-title'))

    await waitFor(() => {
      expect(screen.getByTestId('site-select')).toHaveDisplayValue('Site A')
      expect(screen.getByTestId('management-select')).toHaveDisplayValue(
        'Management Regimes B [Management Regimes 2]',
      )
      expect(screen.getByTestId('depth-input')).toHaveValue(10000)
      expect(screen.getByTestId('sample-date-input')).toHaveValue('2021-04-21')
      expect(screen.getByTestId('sample-time-input')).toHaveValue('12:34')
      expect(screen.getByTestId('transect-number-input')).toHaveValue(56)
      expect(screen.getByTestId('label-input')).toHaveValue('some label')
      expect(screen.getByTestId('len-surveyed-input')).toHaveValue(2)
      expect(screen.getByTestId('reef-slope-select')).toHaveDisplayValue('flat')
      expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
    })
  })
})

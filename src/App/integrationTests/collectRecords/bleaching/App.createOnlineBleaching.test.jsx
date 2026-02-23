import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { mockT } from '../../../../testUtilities/mockT'

import {
  screen,
  within,
  renderAuthenticatedOnline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

const saveBleachingRecord = async (user) => {
  const siteInput = await screen.findByTestId('site-select')
  const managementRegimeInput = await screen.findByTestId('management-select')
  const sampleDateInput = await screen.findByTestId('sample-date-input')
  const labelInput = await screen.findByTestId('label-input')
  const sampleTimeInput = await screen.findByTestId('sample-time-input')
  const depthInput = await screen.findByTestId('depth-input')
  const quadratSizeInput = await screen.findByTestId('quadrat-size-input')
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

  await user.type(sampleDateInput, '2021-04-21')
  expect(sampleDateInput).toHaveValue('2021-04-21')

  await user.type(labelInput, 'some label')
  expect(labelInput).toHaveValue('some label')

  await user.type(sampleTimeInput, '12:34')
  expect(sampleTimeInput).toHaveValue('12:34')

  await user.type(depthInput, '10000')
  expect(depthInput).toHaveValue(10000)

  await user.type(quadratSizeInput, '2')
  expect(quadratSizeInput).toHaveValue(2)

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

describe('Online', () => {
  test('New Bleaching save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveBleachingRecord(user)

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
      expect(within(form).getByTestId('label-input')).toHaveValue('some label')
      expect(screen.getByTestId('quadrat-size-input')).toHaveValue(2)
      expect(screen.getByTestId('visibility-select')).toHaveDisplayValue('1-5m - poor')
      expect(screen.getByTestId('current-select')).toHaveDisplayValue('high')
      expect(screen.getByTestId('relative-depth-select')).toHaveDisplayValue('deep')
      expect(screen.getByTestId('tide-select')).toHaveDisplayValue('falling')
      expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
    })
  }, 50000)

  test('New Bleaching save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveBleachingRecord(user)

    expect(await screen.findByTestId('saved-button'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-collecting'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    // show all the records
    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '22')
    const table = await screen.findByRole('table')

    const linksToBleachingRecords = within(table).getAllByRole('link', {
      name: 'protocol_titles.bleachingqc',
    })

    expect(linksToBleachingRecords).toHaveLength(2)
    expect(mockT).toHaveBeenCalledWith('protocol_titles.bleachingqc')

    // expect unique depth as proxy for New Bleaching
    expect(await within(table).findByText('10000'))
  }, 50000)

  test('New Bleaching save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/bleachingqc'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBleachingRecord(user)

    expect(await screen.findByTestId('save-button'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(screen.getByTestId('bleachingqc-page-title'))

    await waitFor(() => {
      expect(screen.getByTestId('site-select')).toHaveDisplayValue('Site A')
      expect(screen.getByTestId('management-select')).toHaveDisplayValue(
        'Management Regimes B [Management Regimes 2]',
      )
      expect(screen.getByTestId('depth-input')).toHaveValue(10000)
      expect(screen.getByTestId('sample-date-input')).toHaveValue('2021-04-21')
      expect(screen.getByTestId('sample-time-input')).toHaveValue('12:34')
      expect(screen.getByTestId('label-input')).toHaveValue('some label')
      expect(screen.getByTestId('quadrat-size-input')).toHaveValue(2)
      expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
    })
  }, 50000)
})

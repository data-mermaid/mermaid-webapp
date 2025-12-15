import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  within,
  renderAuthenticatedOnline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

const saveNewRecord = async (user) => {
  const siteInput = await screen.findByLabelText('Site')
  const managementRegimeInput = screen.getByLabelText('Management')
  const depthInput = screen.getByLabelText('Depth')
  const sampleDateInput = screen.getByLabelText('Sample Date')
  const sampleTimeInput = screen.getByLabelText('Sample Time')
  const transectNumberInput = screen.getByLabelText('Transect Number')
  const labelInput = screen.getByLabelText('Label')
  const transectLengthInput = screen.getByLabelText('Transect Length Surveyed')
  const reefSlopeInput = screen.getByLabelText('Reef Slope')
  const visibilityInput = screen.getByLabelText('Visibility')
  const currentInput = screen.getByLabelText('Current')
  const relativeDepthInput = screen.getByLabelText('Relative Depth')
  const tideInput = screen.getByLabelText('Tide')
  const notesInput = screen.getByLabelText('Notes')

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

  await user.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Online', () => {
  test('New Benthic LIT save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveNewRecord(user)

    expect(await screen.findByText('Record saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // we constrain some queries to the form element because the form title has similar text that will also be selected
    const form = screen.getByRole('form')

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site A')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes B [Management Regimes 2]',
    )
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(within(form).getByLabelText('Transect Number')).toHaveValue(56)
    expect(within(form).getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(2)
    expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')
    expect(screen.getByLabelText('Visibility')).toHaveDisplayValue('1-5m - poor')
    expect(screen.getByLabelText('Current')).toHaveDisplayValue('high')
    expect(screen.getByLabelText('Relative Depth')).toHaveDisplayValue('deep')
    expect(screen.getByLabelText('Tide')).toHaveDisplayValue('falling')
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  }, 50000)

  test('New Benthic LIT save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveNewRecord(user)

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-collecting'))
    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    await waitFor(() => within(pageSizeSelector).getByText('22'))

    // show all the records
    await user.selectOptions(pageSizeSelector, '22')

    const table = await screen.findByRole('table')

    const linksToBenthicLitRecords = within(table).getAllByRole('link', { name: 'Benthic LIT' })

    expect(linksToBenthicLitRecords).toHaveLength(2)

    // expect unique depth as proxy for New Benthic LIT
    expect(await within(table).findByText('10000'))
  }, 50000)
  test('New Benthic LIT save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveNewRecord(user)

    expect(await screen.findByText('The sample unit has not been saved.'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(
      screen.getByText('Benthic LIT', {
        selector: 'h2',
      }),
    )

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site A')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes B [Management Regimes 2]',
    )
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(56)
    expect(screen.getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(2)
    expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')

    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  }, 50000)
})

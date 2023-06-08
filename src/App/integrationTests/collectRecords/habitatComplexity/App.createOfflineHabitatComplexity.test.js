import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  within,
  renderAuthenticatedOffline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const saveHabitatComplexityRecord = async () => {
  userEvent.selectOptions(await screen.findByLabelText('Site'), '1')
  userEvent.selectOptions(screen.getByLabelText('Management'), '2')
  userEvent.type(screen.getByLabelText('Depth'), '10000')
  userEvent.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  userEvent.type(screen.getByLabelText('Sample Time'), '12:34')

  userEvent.type(screen.getByLabelText('Transect Number'), '56')
  userEvent.type(screen.getByLabelText('Label'), 'some label')
  userEvent.type(screen.getByLabelText('Transect Length Surveyed'), '2')
  userEvent.type(screen.getByLabelText('Interval Size'), '7')
  userEvent.selectOptions(
    screen.getByLabelText('Reef Slope'),
    'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
  )
  userEvent.selectOptions(
    screen.getByLabelText('Visibility'),
    'a3ba3f14-330d-47ee-9763-bc32d37d03a5',
  )
  userEvent.selectOptions(screen.getByLabelText('Current'), 'e5dcb32c-614d-44ed-8155-5911b7ee774a')
  userEvent.selectOptions(
    screen.getByLabelText('Relative Depth'),
    '8f381e71-219e-469c-8c13-231b088fb861',
  )
  userEvent.selectOptions(screen.getByLabelText('Tide'), '97a63da7-e98c-4be7-8f13-e95d38aa17ae')
  userEvent.type(screen.getByLabelText('Notes'), 'some notes')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Offline', () => {
  test('New Habitat Complexity save success shows saved input values, toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveHabitatComplexityRecord()

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
    expect(screen.getByLabelText('Interval Size')).toHaveValue(7)
    expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')
    expect(screen.getByLabelText('Visibility')).toHaveDisplayValue('1-5m - poor')
    expect(screen.getByLabelText('Current')).toHaveDisplayValue('high')
    expect(screen.getByLabelText('Relative Depth')).toHaveDisplayValue('deep')
    expect(screen.getByLabelText('Tide')).toHaveDisplayValue('falling')
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  })
  
  test('New Habitat Complexity save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveHabitatComplexityRecord()

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    userEvent.click(within(sideNav).getByText('Collecting'))

    // show all the records
    userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '22')
    const table = await screen.findByRole('table')

    const linksToHabitatComplexityRecords = within(table).getAllByRole('link', {
      name: 'Habitat Complexity',
    })

    expect(linksToHabitatComplexityRecords).toHaveLength(2)

    // expect unique depth as proxy for New Habitat Complexity
    expect(await within(table).findByText('10000'))
  })

  test('New Habitat Complexity save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveHabitatComplexityRecord()

    expect(await screen.findByText('The sample unit has not been saved.'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(
      screen.getByText('Habitat Complexity', {
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
    expect(screen.getByLabelText('Interval Size')).toHaveValue(7)
    expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')
    expect(screen.getByLabelText('Visibility')).toHaveDisplayValue('1-5m - poor')
    expect(screen.getByLabelText('Current')).toHaveDisplayValue('high')
    expect(screen.getByLabelText('Relative Depth')).toHaveDisplayValue('deep')
    expect(screen.getByLabelText('Tide')).toHaveDisplayValue('falling')
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  })
})

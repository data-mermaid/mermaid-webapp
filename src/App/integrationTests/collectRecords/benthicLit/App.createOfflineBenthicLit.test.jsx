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

const saveBenthicLitRecord = async (user) => {
  await user.selectOptions(await screen.findByLabelText('Site'), '1')
  await user.selectOptions(screen.getByLabelText('Management'), '2')
  await user.type(screen.getByLabelText('Depth'), '10000')
  await user.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  await user.type(screen.getByLabelText('Sample Time'), '12:34')

  await user.type(screen.getByLabelText('Transect Number'), '56')
  await user.type(screen.getByLabelText('Label'), 'some label')
  await user.type(screen.getByLabelText('Transect Length Surveyed'), '2')
  await user.selectOptions(
    screen.getByLabelText('Reef Slope'),
    'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
  )
  await user.selectOptions(
    screen.getByLabelText('Visibility'),
    'a3ba3f14-330d-47ee-9763-bc32d37d03a5',
  )
  await user.selectOptions(screen.getByLabelText('Current'), 'e5dcb32c-614d-44ed-8155-5911b7ee774a')
  await user.selectOptions(
    screen.getByLabelText('Relative Depth'),
    '8f381e71-219e-469c-8c13-231b088fb861',
  )
  await user.selectOptions(screen.getByLabelText('Tide'), '97a63da7-e98c-4be7-8f13-e95d38aa17ae')
  await user.type(screen.getByLabelText('Notes'), 'some notes')

  await user.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Offline', () => {
  test('New Benthic LIT save success shows saved input values, toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicLitRecord(user)

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
  })

  test('New Benthic LIT save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicLitRecord(user)

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-collecting'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    // show all the records
    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '22')
    const table = await screen.findByRole('table')

    const linksToBenthicLitRecords = within(table).getAllByRole('link', { name: 'Benthic LIT' })

    expect(linksToBenthicLitRecords).toHaveLength(2)

    // expect unique depth as proxy for New Benthic LIT
    expect(await within(table).findByText('10000'))
  })
  test('New Benthic LIT save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveBenthicLitRecord(user)

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
  })
})

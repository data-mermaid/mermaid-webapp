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

const saveBleachingRecord = async (user) => {
  await user.selectOptions(await screen.findByLabelText('Site'), '1')
  await user.selectOptions(screen.getByLabelText('Management'), '2')
  await user.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  await user.type(screen.getByLabelText('Label'), 'some label')
  await user.type(screen.getByLabelText('Sample Time'), '12:34')
  await user.type(screen.getByLabelText('Depth'), '10000')
  await user.type(screen.getByLabelText('Quadrat Size'), '2')
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

    expect(await screen.findByText('Record saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // we constrain some queries to the form element because the form title has similar text that will also be selected
    const form = screen.getByRole('form')

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B [Management Regimes 2]'))
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(within(form).getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Quadrat Size')).toHaveValue(2)
    // Visibility select on 1-5m -poor
    expect(screen.getByDisplayValue('1-5m - poor'))
    // Current select on high
    expect(screen.getByDisplayValue('high'))
    // Relative Depth select on deep
    expect(screen.getByDisplayValue('deep'))
    // Tide select on falling
    expect(screen.getByDisplayValue('falling'))
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
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

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByText('Collecting'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    // show all the records
    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '22')
    const table = await screen.findByRole('table')

    const linksToBleachingRecords = within(table).getAllByRole('link', { name: 'Bleaching' })

    expect(linksToBleachingRecords).toHaveLength(2)

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

    expect(await screen.findByText('The sample unit has not been saved.'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(
      screen.getByText('Bleaching', {
        selector: 'h2',
      }),
    )

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B [Management Regimes 2]'))
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(screen.getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Quadrat Size')).toHaveValue(2)
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  }, 50000)
})

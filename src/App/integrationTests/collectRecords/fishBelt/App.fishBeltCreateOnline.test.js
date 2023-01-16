import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  within,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

const saveFishbeltRecord = async () => {
  userEvent.selectOptions(await screen.findByLabelText('Site'), '1')
  userEvent.selectOptions(screen.getByLabelText('Management'), '2')
  userEvent.type(screen.getByLabelText('Depth'), '10000')
  userEvent.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  userEvent.type(screen.getByLabelText('Sample Time'), '12:34')

  userEvent.type(screen.getByLabelText('Transect Number'), '56')
  userEvent.type(screen.getByLabelText('Label'), 'some label')
  userEvent.type(screen.getByLabelText('Transect Length Surveyed'), '2')
  userEvent.click(within(screen.getByTestId('width')).getByLabelText('10m'))
  userEvent.click(within(screen.getByTestId('size_bin')).getByLabelText('1'))
  userEvent.click(within(screen.getByTestId('reef_slope')).getByLabelText('flat'))
  userEvent.click(within(screen.getByTestId('visibility')).getByLabelText('1-5m - poor'))
  userEvent.click(within(screen.getByTestId('current')).getByLabelText('high'))
  userEvent.click(within(screen.getByTestId('relative_depth')).getByLabelText('deep'))
  userEvent.click(within(screen.getByTestId('tide')).getByLabelText('falling'))
  userEvent.type(screen.getByLabelText('Notes'), 'some notes')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Online', () => {
  test('New fishbelt save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveFishbeltRecord()

    expect(await screen.findByText('Record saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B'))
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(56)
    expect(screen.getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(2)
    expect(within(screen.getByTestId('width')).getByLabelText('10m')).toBeChecked()
    expect(within(screen.getByTestId('size_bin')).getByLabelText('1')).toBeChecked()
    expect(within(screen.getByTestId('reef_slope')).getByLabelText('flat')).toBeChecked()
    expect(within(screen.getByTestId('visibility')).getByLabelText('1-5m - poor')).toBeChecked()
    expect(within(screen.getByTestId('current')).getByLabelText('high')).toBeChecked()
    expect(within(screen.getByTestId('relative_depth')).getByLabelText('deep')).toBeChecked()
    expect(within(screen.getByTestId('tide')).getByLabelText('falling')).toBeChecked()
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  }, 50000)
  test('New fishbelt save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/'],
      },
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    )

    await saveFishbeltRecord()

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    userEvent.click(within(sideNav).getByText('Collecting'))

    // show all the records
    userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '21')
    const table = await screen.findByRole('table')

    const linksToFishbeltRecords = within(table).getAllByRole('link', { name: 'Fish Belt' })

    // 17 the 16 mock records + the one we just created
    expect(linksToFishbeltRecords).toHaveLength(17)

    // expect unique depth as proxy for new fishbelt
    expect(await within(table).findByText('10000'))
  }, 50000)
  test('New fishbelt save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveFishbeltRecord()

    expect(await screen.findByText('Something went wrong. The sample unit has not been saved.'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(
      screen.getByText('Fish Belt', {
        selector: 'h2',
      }),
    )

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B'))
    expect(screen.getByLabelText('Depth')).toHaveValue(10000)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(56)
    expect(screen.getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(2)
    // width radio checked on 1
    expect(screen.getByLabelText('10m')).toBeChecked()
    // fish size bin radio checked on 1
    expect(screen.getByLabelText('1')).toBeChecked()
    // reef slope radio checked on flat value
    expect(screen.getByLabelText('flat')).toBeChecked()

    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  }, 50000)
})

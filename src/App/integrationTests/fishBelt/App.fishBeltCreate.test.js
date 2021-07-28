import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  within,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const saveFishbeltRecord = async () => {
  userEvent.selectOptions(await screen.findByLabelText('Site'), '1')
  userEvent.selectOptions(screen.getByLabelText('Management'), '2')
  userEvent.type(screen.getByLabelText('Depth'), '10')
  userEvent.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  userEvent.type(screen.getByLabelText('Sample Time'), '12:34')

  userEvent.type(screen.getByLabelText('Transect Number'), '56')
  userEvent.type(screen.getByLabelText('Label'), 'some label')
  userEvent.type(screen.getByLabelText('Transect Length Surveyed'), '2')
  // user clicks Width radio value 1
  userEvent.click(screen.getByLabelText('10m'))

  // user clicks on Fish Size Bin radio value 1
  userEvent.click(screen.getByLabelText('1'))

  // user clicks on Reef Slope radio value flat
  userEvent.click(screen.getByLabelText('flat'))

  userEvent.type(screen.getByLabelText('Notes'), 'some notes')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Offline', () => {
  test('New fishbelt save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOffline(
      <App dexieInstance={dexieInstance} />,
      {
        initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
      },
      dexieInstance,
    )

    await saveFishbeltRecord()

    expect(await screen.findByText('Collect record saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B'))
    expect(screen.getByLabelText('Depth')).toHaveValue(10)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-04-21')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('12:34')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(56)
    expect(screen.getByLabelText('Label')).toHaveValue('some label')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(2)
    // width radio checked on 1
    expect(screen.getByLabelText('10m')).toBeChecked()
    // fish size bin radio checked on 1
    expect(screen.getByLabelText('1')).toBeChecked()
    // reef slope radio checked on flat
    expect(screen.getByLabelText('flat')).toBeChecked()
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  })
  test('New fishbelt save success show new record in collecting table', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
      {
        initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
      },
    )

    await saveFishbeltRecord()

    expect(await screen.findByText('Collect record saved.'))

    const sideNav = screen.getByTestId('content-page-side-nav')

    userEvent.click(within(sideNav).getByText('Collecting'))

    const tableRows = await screen.findAllByRole('row', { hidden: true })
    const collectRecordRow = tableRows[1]

    // 2 here because the header row + the 1 collect record we just created
    expect(tableRows).toHaveLength(2)
    expect(within(collectRecordRow).getByText('Fish Belt'))
    expect(within(collectRecordRow).getByText('Site A'))
    expect(within(collectRecordRow).getByText('Management Regimes B'))
    // sample unit #
    expect(within(collectRecordRow).getByText('56 some label'))
    // size
    expect(within(collectRecordRow).getByText('2m x 10m'))
    // depth
    expect(within(collectRecordRow).getByText('10'))
    expect(within(collectRecordRow).getByText('April 21, 2021'))
  })
  test('New fishbelt save failure shows toast message with edits persisting', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    dexieInstance.collect_records.put = () => Promise.reject()
    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
      dexieInstance,
    })

    await saveFishbeltRecord()

    expect(
      await screen.findByText(
        'Something went wrong. The collect record has not been saved.',
      ),
    )

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
    expect(screen.getByLabelText('Depth')).toHaveValue(10)
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
  })
})

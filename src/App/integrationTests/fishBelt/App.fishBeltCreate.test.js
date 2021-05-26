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

const saveFishbeltRecord = async () => {
  userEvent.selectOptions(await screen.findByLabelText('Site'), '1')
  userEvent.selectOptions(screen.getByLabelText('Management'), '2')
  userEvent.type(screen.getByLabelText('Depth'), '10')
  userEvent.type(screen.getByLabelText('Sample Date'), '2021-04-21')
  userEvent.type(screen.getByLabelText('Sample Time'), '12:34')

  userEvent.type(screen.getByLabelText('Transect Number'), '56')
  userEvent.type(screen.getByLabelText('Label'), 'some label')
  userEvent.type(screen.getByLabelText('Transect Length Surveyed'), '2')
  userEvent.selectOptions(
    screen.getByLabelText('Width'),
    '228c932d-b5da-4464-b0df-d15a05c05c02',
  )
  userEvent.selectOptions(
    screen.getByLabelText('Fish Size Bin'),
    '67c1356f-e0a7-4383-8034-77b2f36e1a49',
  )
  userEvent.selectOptions(
    screen.getByLabelText('Reef Slope'),
    'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
  )

  userEvent.type(screen.getByLabelText('Notes'), 'some notes')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Offline', () => {
  test('New fishbelt save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
      {
        initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
      },
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
    // width select
    expect(screen.getByDisplayValue('10m'))
    // fish size bin select
    expect(screen.getByDisplayValue(1))
    // reef slope select
    expect(screen.getByDisplayValue('flat'))
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

    dexieInstance.collectRecords.put = () => Promise.reject()
    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
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
    // width select
    expect(screen.getByDisplayValue('10m'))
    // fish size bin select
    expect(screen.getByDisplayValue(1))
    // reef slope select
    expect(screen.getByDisplayValue('flat'))
    expect(screen.getByLabelText('Notes')).toHaveValue('some notes')
  })
})

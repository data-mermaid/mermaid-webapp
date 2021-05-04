import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  mockMermaidApiAllSuccessful,
  within,
  renderAuthenticatedOffline,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})

afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

const navigateToNewFishbeltForm = async () => {
  const firstProjetcCollectingLink = screen.getAllByText('Collecting')[0]

  userEvent.click(firstProjetcCollectingLink)

  userEvent.click(await screen.findByText('Add Sample Unit'), {
    selector: 'button',
  })

  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  userEvent.click(within(sampleUnitNav).getByText('Fish Belt'), {
    selector: 'a',
  })
}

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

describe('delete fishbelt', () => {
  test('Delete fishbelt prompt confirm deletes the record with the proper UI response and messaging', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )

    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    userEvent.click(await screen.findByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(
      screen.getByText('Yes', {
        selector: 'button',
      }),
    )

    // navigated to collect records table page
    expect(await screen.findByText('Collect Records', { selector: 'h3' }))

    // shows toast
    expect(await screen.findByText('Collect record deleted.'))

    // row length = 1 because of header row. Expect there to be no records.
    expect(
      screen.getAllByRole('row', {
        hidden: true,
      }).length,
    ).toEqual(1)
  })

  test('Delete fishbelt prompt cancel closes prompt and does nothing (edits persisted)', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )

    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // make an unsaved change
    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(
      screen.getByText('No', {
        selector: 'button',
      }),
    )

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })

  test('Delete fishbelt prompt confirm deletes the record with the proper UI response and messaging', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )

    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    userEvent.click(await screen.findByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(
      screen.getByText('Yes', {
        selector: 'button',
      }),
    )

    // navigated to collect records table page
    expect(
      await screen.findByText(
        'Collect Records',
        { selector: 'h3' },
        { timeout: 2000 },
      ),
    )

    // shows toast
    expect(await screen.findByText('Collect record deleted.'))

    // row length = 1 because of header row. Expect there to be no records.
    expect(
      screen.getAllByRole('row', {
        hidden: true,
      }).length,
    ).toEqual(1)
  })

  test('Delete fishbelt prompt cancel closes prompt and does nothing (edits persisted)', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )

    // maybe make this unit test, smaller dom tree
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // make an unsaved change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(screen.getByText('No'), {
      selector: 'button',
    })

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })
})

describe('New fishbelt', () => {
  test('New fishbelt save success shows toast, and navigates to edit fishbelt page for new record', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )
    await navigateToNewFishbeltForm()
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
    )
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )
    await navigateToNewFishbeltForm()
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
    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />)
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
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

describe('Edit fishbelt', () => {
  test('Edit fishbelt save success shows toast message and proper record information', async () => {
    renderAuthenticatedOffline(
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    )
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()
    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // make an unsaved change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Collect record saved.'))

    // Site select
    expect(screen.getByDisplayValue('Site A'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes B'))
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
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
  test('Edit fishbelt save failure shows toast message with new edits persisting', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    dexieInstance.collectRecords.put = jest
      .fn()
      .mockImplementationOnce(dexieInstance.collectRecords.put)
      .mockRejectedValueOnce()

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />)
    expect(
      await screen.findByText('Projects', {
        selector: 'h1',
      }),
    )

    await navigateToNewFishbeltForm()

    await saveFishbeltRecord()

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    // make an unsaved change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(
      await screen.findByText(
        'Something went wrong. The collect record has not been saved.',
      ),
    )

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })
})

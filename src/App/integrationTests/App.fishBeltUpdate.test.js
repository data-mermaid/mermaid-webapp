import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidData from '../../testUtilities/mockMermaidData'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})

afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

describe('Offline', () => {
  test('Edit fishbelt save success shows toast message and proper record information', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    // make a change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Collect record saved.'))

    // Site select
    expect(screen.getByDisplayValue('Site D'))
    // Management select
    expect(screen.getByDisplayValue('Management Regimes C'))
    expect(screen.getByLabelText('Depth')).toHaveValue(45)
    expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-03-02')
    expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
    expect(screen.getByLabelText('Transect Number')).toHaveValue(2)
    expect(screen.getByLabelText('Label')).toHaveValue('FB-2')
    expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(6)
    // width radio
    expect(screen.getByLabelText('2m')).toBeChecked()
    // fish size bin radio
    expect(screen.getByLabelText('5')).toBeChecked()
    // reef slope radio
    expect(screen.getByLabelText('flat')).toBeChecked()
    expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
  })
  test('Edit fishbelt save failure shows toast message with new edits persisting', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    // make sure the next save will fail
    dexieInstance.collectRecords.put = jest.fn().mockRejectedValueOnce()

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    // make an unsaved change
    const depthInput = await screen.findByLabelText('Depth')

    userEvent.clear(depthInput)
    userEvent.type(depthInput, '45')
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

import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidData from '../../testUtilities/mockMermaidData'

describe('Offline', () => {
  test('Delete fishbelt prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    userEvent.click(await screen.findByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    userEvent.click(
      within(modal).getByText('Delete Record', {
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
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    // make an unsaved change
    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(
      screen.getByText('Cancel', {
        selector: 'button',
      }),
    )

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })

  test('Delete fishbelt prompt confirm deletes the record with the proper UI response and messaging', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    userEvent.click(await screen.findByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    userEvent.click(
      within(modal).getByText('Delete Record', {
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
    const dexieInstance = getMockDexieInstanceAllSuccess()

    // make sure there is a collect record to edit in dexie
    await dexieInstance.collectRecords.put(mockMermaidData.collectRecords[1])

    renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    })

    // make an unsaved change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    userEvent.click(screen.getByText('Cancel'), {
      selector: 'button',
    })

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })
})

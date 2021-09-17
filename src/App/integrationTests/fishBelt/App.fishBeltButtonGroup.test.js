import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOnline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

describe('Online', () => {
  test('Edit Fishbelt - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    screen.getByText('Save', { selector: 'button' })

    expect(screen.getByText('Validate', { selector: 'button' })).toBeDisabled()

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    await screen.findByText('Saving', { selector: 'button' })

    expect(await screen.findByText('Collect record saved.'))

    await screen.findByText('Saved', { selector: 'button' })
    expect(screen.getByText('Validate', { selector: 'button' })).toBeEnabled()
  })

  test('Edit Fishbelt - Validate button clicked -> send record to validate api endpoint -> Record is failed to validate, and ready to validate again.', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    userEvent.click(await screen.findByText('Validate', { selector: 'button' }))

    // there should be an insert on hitting validate endpoint here, and supposed to fail.

    await screen.findByText('Validating', { selector: 'button' })

    await screen.findByText('Validate', { selector: 'button' })
  })
})

import { describe, expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete Benthic LIT prompt cancel closes prompt and does nothing (edits persisted)', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/benthiclit/70'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    // make an unsaved change

    await user.clear(await screen.findByTestId('depth-input'))
    await user.type(screen.getByTestId('depth-input'), '45')

    await user.click(screen.getByTestId('delete-record-button'))

    expect(screen.getByTestId('delete-record-prompt'))

    expect(screen.getByTestId('delete-record-modal'))

    await user.click(screen.getByTestId('delete-record-cancel-button'))

    expect(screen.queryByTestId('delete-record-prompt')).not.toBeInTheDocument()

    expect(await screen.findByTestId('depth-input')).toHaveValue(45)
  })
})

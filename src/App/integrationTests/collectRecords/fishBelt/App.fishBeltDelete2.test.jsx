import { describe, expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  waitFor,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete fishbelt prompt cancel closes prompt and does nothing (edits persisted)', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/2'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await screen.findByTestId('loading-indicator')
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
    // make an unsaved change

    await user.clear(screen.getByTestId('depth-input'))
    await user.type(screen.getByTestId('depth-input'), '45')

    await user.click(screen.getByTestId('delete-record-button'))

    expect(screen.getByTestId('delete-record-prompt'))

    expect(screen.getByTestId('delete-record-modal'))

    await user.click(screen.getByTestId('delete-record-cancel-button'))

    expect(screen.queryByTestId('delete-record-prompt')).not.toBeInTheDocument()

    await waitFor(async () => expect(screen.getByTestId('depth-input')).toHaveValue(45))
  })
})

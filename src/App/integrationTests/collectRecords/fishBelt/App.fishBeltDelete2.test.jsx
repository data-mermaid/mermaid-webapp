import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  within,
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

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )
    // make an unsaved change

    await user.clear(screen.getByLabelText('Depth'))
    await user.type(screen.getByLabelText('Depth'), '45')

    await user.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    await user.click(
      within(modal).getByText('Cancel', {
        selector: 'button',
      }),
    )

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    await waitFor(async () => expect(screen.getByLabelText('Depth')).toHaveValue(45))
  })
})

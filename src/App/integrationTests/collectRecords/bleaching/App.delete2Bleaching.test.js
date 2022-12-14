import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOffline,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
// test suite cut up into 2 parts for performance reasons
describe('Offline', () => {
  test('Delete bleaching collect record prompt cancel closes prompt and does nothing (edits persisted)', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    // make an unsaved change

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    userEvent.click(screen.getByText('Delete Record'))

    expect(screen.getByText('Are you sure you want to delete this record?'))

    const modal = screen.getByLabelText('Delete Record')

    userEvent.click(
      within(modal).getByText('Cancel', {
        selector: 'button',
      }),
    )

    expect(
      screen.queryByText('Are you sure you want to delete this record?'),
    ).not.toBeInTheDocument()

    expect(await screen.findByLabelText('Depth')).toHaveValue(45)
  })
})

import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOffline,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../../App'

const renderBenthicPhotoQuadratRecord = async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpqt/90'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  return { user, dexiePerUserDataInstance }
}

const saveAndGetRecord = async ({ user, dexiePerUserDataInstance }) => {
  await user.click(screen.getByTestId('save-button'))
  await screen.findByTestId('saved-button')

  return dexiePerUserDataInstance.collect_records.get('90')
}

describe('Benthic photo quadrat observation number inputs', () => {
  test('quadrat numbers and points saved as text by older versions are saved back as numbers', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicPhotoQuadratRecord()

    const depthInput = screen.getByTestId('depth-input')

    await user.clear(depthInput)
    await user.type(depthInput, '45')

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })
    const untouchedObservation = savedRecord.data.obs_benthic_photo_quadrats[1]

    expect(untouchedObservation.quadrat_number).toBe(2)
    expect(untouchedObservation.num_points).toBe(1)
  })
})

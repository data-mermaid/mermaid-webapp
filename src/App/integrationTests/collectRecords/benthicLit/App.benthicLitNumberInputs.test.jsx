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

const renderBenthicLitRecord = async () => {
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

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  return { user, dexiePerUserDataInstance }
}

const saveAndGetRecord = async ({ user, dexiePerUserDataInstance }) => {
  await user.click(screen.getByTestId('save-button'))
  await screen.findByTestId('saved-button')

  return dexiePerUserDataInstance.collect_records.get('70')
}

describe('Benthic LIT observation number inputs', () => {
  test('lengths saved as text by older versions are saved back as numbers', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicLitRecord()

    const depthInput = screen.getByTestId('depth-input')

    await user.clear(depthInput)
    await user.type(depthInput, '45')

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })

    expect(savedRecord.data.obs_benthic_lits[1].length).toBe(2)
  })

  test('a new row saves an empty length as null', async () => {
    const { user, dexiePerUserDataInstance } = await renderBenthicLitRecord()

    await user.click(screen.getByTestId('add-observation-row'))

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })

    expect(savedRecord.data.obs_benthic_lits).toHaveLength(4)
    expect(savedRecord.data.obs_benthic_lits[3].length).toBeNull()
  })
})

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

const COUNT_PROPERTIES = [
  'count_normal',
  'count_pale',
  'count_20',
  'count_50',
  'count_80',
  'count_100',
  'count_dead',
]

const countsAsText = (observation) => ({
  ...observation,
  ...Object.fromEntries(
    COUNT_PROPERTIES.map((property) => [property, String(observation[property])]),
  ),
})

const renderBleachingRecord = async ({ updateRecordData = (data) => data } = {}) => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const collectRecord = await dexiePerUserDataInstance.collect_records.get('60')

  await dexiePerUserDataInstance.collect_records.put({
    ...collectRecord,
    data: updateRecordData(collectRecord.data),
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
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

  return dexiePerUserDataInstance.collect_records.get('60')
}

const changeDepth = async (user) => {
  const depthInput = screen.getByTestId('depth-input')

  await user.clear(depthInput)
  await user.type(depthInput, '45')
}

describe('Bleaching observation number inputs', () => {
  test('percent cover saved as text by older versions is saved back as numbers', async () => {
    const { user, dexiePerUserDataInstance } = await renderBleachingRecord()

    await changeDepth(user)

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })
    const { percent_hard, percent_soft, percent_algae } =
      savedRecord.data.obs_quadrat_benthic_percent[1]

    expect({ percent_hard, percent_soft, percent_algae }).toEqual({
      percent_hard: 50,
      percent_soft: 1,
      percent_algae: 1,
    })
  })

  test('colony counts saved as text by older versions are saved back as numbers', async () => {
    const { user, dexiePerUserDataInstance } = await renderBleachingRecord({
      updateRecordData: (data) => ({
        ...data,
        obs_colonies_bleached: data.obs_colonies_bleached.map(countsAsText),
      }),
    })

    await changeDepth(user)

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })
    const untouchedObservation = savedRecord.data.obs_colonies_bleached[1]

    COUNT_PROPERTIES.forEach((property) => {
      expect(untouchedObservation[property]).toBe(1)
    })
  })

  test('a new percent cover row saves empty percentages as null', async () => {
    const { user, dexiePerUserDataInstance } = await renderBleachingRecord()

    await user.click(screen.getAllByTestId('add-observation-row')[1])

    const savedRecord = await saveAndGetRecord({ user, dexiePerUserDataInstance })
    const { percent_hard, percent_soft, percent_algae } =
      savedRecord.data.obs_quadrat_benthic_percent[3]

    expect({ percent_hard, percent_soft, percent_algae }).toEqual({
      percent_hard: null,
      percent_soft: null,
      percent_algae: null,
    })
  })
})

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

const ONE_CM_SIZE_BIN_ID = 'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf'
const FIVE_CM_SIZE_BIN_ID = 'f0c1e3d5-4a7b-4f8e-9c6e-2f1b5c3d9e2a'

const renderBeltInvertRecord = async ({
  sizeBin,
  updateObservation = (observation) => observation,
}) => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const collectRecord = await dexiePerUserDataInstance.collect_records.get('bi-2')

  await dexiePerUserDataInstance.collect_records.put({
    ...collectRecord,
    data: {
      ...collectRecord.data,
      beltinvert_transect: { ...collectRecord.data.beltinvert_transect, size_bin: sizeBin },
      obs_belt_inverts: collectRecord.data.obs_belt_inverts.map(updateObservation),
    },
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/bi-2'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  return { user, dexiePerUserDataInstance }
}

describe('Belt invert observation number inputs', () => {
  test('sizes and counts saved as text by older versions are saved back as numbers', async () => {
    const { user, dexiePerUserDataInstance } = await renderBeltInvertRecord({
      sizeBin: ONE_CM_SIZE_BIN_ID,
      updateObservation: (observation) => ({
        ...observation,
        size: String(observation.size),
        count: String(observation.count),
      }),
    })

    const firstCountInput = screen.getAllByTestId('invert-count-input')[0]

    await user.clear(firstCountInput)
    await user.type(firstCountInput, '7')
    await user.click(screen.getByTestId('save-button'))
    await screen.findByTestId('saved-button')

    const savedRecord = await dexiePerUserDataInstance.collect_records.get('bi-2')
    const untouchedObservation = savedRecord.data.obs_belt_inverts[1]

    expect(untouchedObservation.size).toBe(12.5)
    expect(untouchedObservation.count).toBe(2)
  })

  test('changing the size bin clears sizes to null', async () => {
    const { user, dexiePerUserDataInstance } = await renderBeltInvertRecord({
      sizeBin: FIVE_CM_SIZE_BIN_ID,
    })

    await user.selectOptions(
      screen.getByTestId('size-bin').querySelector('select'),
      ONE_CM_SIZE_BIN_ID,
    )
    await user.click(await screen.findByRole('button', { name: 'clear_size_values' }))
    await user.click(screen.getByTestId('save-button'))
    await screen.findByTestId('saved-button')

    const savedRecord = await dexiePerUserDataInstance.collect_records.get('bi-2')

    expect(savedRecord.data.obs_belt_inverts.map((observation) => observation.size)).toEqual([
      null,
      null,
      null,
    ])
  })
})

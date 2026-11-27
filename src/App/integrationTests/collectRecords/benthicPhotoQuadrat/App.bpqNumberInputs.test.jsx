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
  test('number of points keeps whole numbers', async () => {
    const { user } = await renderBenthicPhotoQuadratRecord()

    const numberOfPointsInput = screen.getAllByTestId('number-of-points-input')[0]

    await user.clear(numberOfPointsInput)
    await user.type(numberOfPointsInput, '12.5')
    await user.tab()

    expect(numberOfPointsInput).toHaveDisplayValue('12')
  })

  test('quadrat number keeps whole numbers', async () => {
    const { user } = await renderBenthicPhotoQuadratRecord()

    const quadratNumberInput = screen.getAllByTestId('quadrat-number-input')[0]

    await user.clear(quadratNumberInput)
    await user.type(quadratNumberInput, '1.5')
    await user.tab()

    expect(quadratNumberInput).toHaveDisplayValue('1')
  })

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

  test('Tab on the last number of points copies a value typed with a leading zero', async () => {
    const { user } = await renderBenthicPhotoQuadratRecord()

    const lastNumberOfPointsInput = screen.getAllByTestId('number-of-points-input').at(-1)

    await user.clear(lastNumberOfPointsInput)
    await user.type(lastNumberOfPointsInput, '05')
    await user.tab()

    const numberOfPointsInputs = await screen.findAllByTestId('number-of-points-input')

    expect(numberOfPointsInputs).toHaveLength(4)
    expect(numberOfPointsInputs[2]).toHaveDisplayValue('5')
    expect(numberOfPointsInputs[3]).toHaveDisplayValue('5')
  })
})

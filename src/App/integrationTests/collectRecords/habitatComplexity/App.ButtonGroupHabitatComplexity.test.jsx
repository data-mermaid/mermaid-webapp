import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import App from '../../../App'
import mockPullAfterValidate from '../../../../testUtilities/mockPullAfterValidate'
import mockHabitatComplexityCollectRecords from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'
import mockHabitatComplexityValidationsObject from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityValidationsObject'

test('Edit Habitat Complexity - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await user.clear(await screen.findByTestId('depth-input'))
  await user.type(screen.getByTestId('depth-input'), '45')

  expect(screen.getByTestId('save-button'))

  expect(screen.getByTestId('validate-button')).toBeDisabled()

  await user.click(screen.getByTestId('save-button'))

  expect(await screen.findByTestId('saving-button'))

  expect(await screen.findByTestId('saved-button'))
  expect(screen.getByTestId('validate-button')).toBeEnabled()
  expect(screen.getByTestId('submit-button')).toBeDisabled()
})

test('Validate Habitat Complexity: fails to validate, shows button able to run validation again.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockPullAfterValidate({
    ...mockHabitatComplexityCollectRecords[0],
    validations: mockHabitatComplexityValidationsObject,
  })

  await user.click(await screen.findByTestId('validate-button'))

  expect(await screen.findByTestId('validating-button'))

  expect(await screen.findByTestId('validate-button'))
  expect(screen.queryByText('sample_units.errors.validation_unavailable')).not.toBeInTheDocument()
})

test('Validate & submit Habitat Complexity: validation passes, shows validate button disabled with proper text, submit is enabled. On submit, submit button is disabled and has "submitting" text', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockPullAfterValidate({
    ...mockHabitatComplexityCollectRecords[0],
    validations: { status: 'ok' },
  })

  await user.click(await screen.findByTestId('validate-button'))

  expect(await screen.findByTestId('validating-button'))

  expect(await screen.findByTestId('validated-button'))
  expect(screen.queryByText('sample_units.errors.validation_unavailable')).not.toBeInTheDocument()

  expect(await screen.findByTestId('submit-button')).toBeEnabled()

  await user.click(await screen.findByTestId('submit-button'))

  expect(await screen.findByTestId('submitting-button')).toBeDisabled()
})

test('Initial load of successfully validated record', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  mockPullAfterValidate({
    ...mockHabitatComplexityCollectRecords[0],
    validations: { status: 'ok' },
  })

  await user.click(await screen.findByTestId('validate-button'))

  expect(await screen.findByTestId('saved-button')).toBeDisabled()
  expect(await screen.findByTestId('validated-button')).toBeDisabled()
  expect(await screen.findByTestId('submit-button')).toBeEnabled()
})

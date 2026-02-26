import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import { Route, Routes } from 'react-router-dom'
import React from 'react'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import ManagementRegime from './ManagementRegime'

test('Edit Management Regime - shows name and rules required', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/management-regimes/:managementRegimeId"
        element={<ManagementRegime isNewManagementRegime={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/management-regimes/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  // check that name and rules validations appear
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const nameInput = screen.getByTestId('name-input')
  const secondaryNameInput = screen.getByTestId('secondary-name-input')

  // Wait for formik to initialize with fetched data before interacting
  await waitFor(() => expect(nameInput).not.toHaveValue(''))

  await user.click(nameInput)
  await user.clear(nameInput)
  await user.click(secondaryNameInput)

  expect(
    await within(screen.getByTestId('name')).findByTestId('inline-message-error'),
  ).toBeInTheDocument()

  const gearRestrictionCheckbox = await screen.findByTestId('rules-gear-restriction-checkbox')

  await user.click(gearRestrictionCheckbox)

  expect(
    await within(screen.getByTestId('rules')).findByTestId('inline-message-error'),
  ).toBeInTheDocument()

  expect(await screen.findByTestId('save-button-management-regime-form')).toBeDisabled()

  // fix name and rules inputs, and make sure save button enables
  await user.type(nameInput, 'fjkdlsfjd')
  await user.click(gearRestrictionCheckbox)

  await waitFor(() => expect(gearRestrictionCheckbox).toBeChecked())

  await waitFor(() => expect(nameInput).toHaveValue('fjkdlsfjd')) // name input doesnt update in test, so button cant be enabled

  await waitFor(() =>
    expect(screen.getByTestId('save-button-management-regime-form')).toBeEnabled(),
  )
})

test('Management Regime component renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/management-regimes/:managementRegimeId"
        element={<ManagementRegime isNewManagementRegime={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/management-regimes/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  // Wait for formik to initialize with fetched data
  await waitFor(() =>
    expect(
      screen.getByText('Management Regimes B', {
        selector: 'h2',
      }),
    ),
  )

  expect(screen.getByTestId('name-input'))
  expect(screen.getByTestId('secondary-name-input'))
  expect(screen.getByTestId('year-established-input'))
  expect(screen.getByTestId('area-input'))
  expect(screen.getByTestId('parties'))
  expect(screen.getByTestId('rules'))
  expect(screen.getByTestId('compliance'))
  expect(screen.getByTestId('notes-textarea'))
})

test('Management Regime component - form inputs are initialized with the correct values', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/management-regimes/:managementRegimeId"
        element={<ManagementRegime isNewManagementRegime={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/management-regimes/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  // Wait for formik to initialize with fetched data
  await waitFor(() => expect(screen.getByTestId('name-input')).toHaveValue('Management Regimes B'))
  expect(screen.getByTestId('secondary-name-input')).toHaveValue('Management Regimes 2')
  expect(screen.getByTestId('year-established-input')).toHaveValue(null)
  expect(screen.getByTestId('area-input')).toHaveValue(10)
  const parties = screen.getByTestId('parties')

  expect(within(parties).getByTestId('parties-ngo-checkbox')).not.toBeChecked()
  expect(
    within(parties).getByTestId('parties-community-local-government-checkbox'),
  ).not.toBeChecked()
  expect(await within(parties).findByTestId('parties-government-checkbox')).toBeChecked()
  expect(within(parties).getByTestId('parties-private-sector-checkbox')).not.toBeChecked()
  expect(within(screen.getByTestId('rules')).getByTestId('rules-open-access-radio')).toBeChecked()
  expect(within(screen.getByTestId('rules')).getByTestId('rules-no-take-radio')).not.toBeChecked()
  expect(
    within(screen.getByTestId('rules')).getByTestId('rules-partial-restrictions-radio'),
  ).not.toBeChecked()

  expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('none')
  expect(screen.getByTestId('notes-textarea')).toHaveValue('Some notes')
})

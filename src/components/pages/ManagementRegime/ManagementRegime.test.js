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
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const nameInput = screen.getByLabelText('Name')
  const secondaryNameInput = screen.getByLabelText('Secondary Name')

  await user.click(nameInput)
  await user.clear(nameInput)
  await user.click(secondaryNameInput)

  expect(
    await within(screen.getByTestId('name')).findByText('This field is required'),
  ).toBeInTheDocument()

  const gearRestrictionCheckbox = await screen.findByLabelText('Gear Restriction')

  await user.click(gearRestrictionCheckbox)

  expect(
    await within(screen.getByTestId('rules')).findByText('At least one rule is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // fix name and rules inputs, and make sure save button enables
  await user.type(nameInput, 'fjkdlsfjd')
  await user.click(gearRestrictionCheckbox)

  await waitFor(() => expect(gearRestrictionCheckbox).toBeChecked())

  await waitFor(() => expect(nameInput).toHaveValue('fjkdlsfjd')) // name input doesnt update in test, so button cant be enabled

  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  expect(
    screen.getByText('Management Regimes B', {
      selector: 'h2',
    }),
  )

  expect(screen.getByLabelText('Name'))
  expect(screen.getByLabelText('Secondary Name'))
  expect(screen.getByLabelText('Year Established'))
  expect(screen.getByLabelText('Area'))
  expect(screen.getByText('Parties'))
  expect(screen.getByText('Rules'))
  expect(screen.getByText('Compliance'))
  expect(screen.getByLabelText('Notes'))
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  expect(screen.getByLabelText('Name')).toHaveValue('Management Regimes B')
  expect(screen.getByLabelText('Secondary Name')).toHaveValue('Management Regimes 2')
  expect(screen.getByLabelText('Year Established')).toHaveValue(null)
  expect(screen.getByLabelText('Area')).toHaveValue(10)
  const parties = screen.getByLabelText('Parties')

  expect(within(parties).getByLabelText('NGO')).not.toBeChecked()
  expect(within(parties).getByLabelText('community/local government')).not.toBeChecked()
  expect(await within(parties).findByLabelText('government')).toBeChecked()
  expect(within(parties).getByLabelText('private sector')).not.toBeChecked()
  expect(
    within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
  ).toBeChecked()
  expect(
    within(screen.getByLabelText('Rules')).getByLabelText('No Take', { exact: false }),
  ).not.toBeChecked()
  expect(
    within(screen.getByLabelText('Rules')).getByLabelText('Partial Restrictions', {
      exact: false,
    }),
  ).not.toBeChecked()

  expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('none')
  expect(screen.getByLabelText('Notes')).toHaveValue('Some notes')
})

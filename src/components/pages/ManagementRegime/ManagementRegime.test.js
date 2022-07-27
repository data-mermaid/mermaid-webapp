import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import ManagementRegime from './ManagementRegime'

test('Edit Management Regime - shows name and rules required', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/management-regimes/:managementRegimeId">
      <ManagementRegime />
    </Route>,
    {
      initialEntries: ['/projects/5/management-regimes/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  // check that name and rules validations appear
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const nameInput = screen.getByLabelText('Name')

  userEvent.clear(nameInput)

  expect(
    await within(screen.getByTestId('name')).findByText('This field is required'),
  ).toBeInTheDocument()

  const gearRestrictionCheckbox = screen.getByLabelText('Gear Restriction')

  expect(gearRestrictionCheckbox).toBeChecked()
  userEvent.click(gearRestrictionCheckbox)
  expect(
    await within(screen.getByTestId('rules')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // fix name and rules inputs, and make sure save button enables
  userEvent.type(nameInput, 'fjkdlsfjd')
  userEvent.click(gearRestrictionCheckbox)

  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

test('Management Regime component renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/management-regimes/:managementRegimeId">
      <ManagementRegime />
    </Route>,
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
    <Route path="/projects/:projectId/management-regimes/:managementRegimeId">
      <ManagementRegime />
    </Route>,
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

  expect(screen.getByLabelText('government')).toBeChecked()

  expect(screen.getByLabelText(/Open Access/)).toBeChecked()

  expect(screen.getByLabelText('none')).toBeChecked()
  expect(screen.getByLabelText('Notes')).toHaveValue('Some notes')
})

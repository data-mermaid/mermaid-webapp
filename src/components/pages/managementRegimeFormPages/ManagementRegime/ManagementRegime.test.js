import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import ManagementRegime from './ManagementRegime'

test('Edit fishbelt shows name and rules required', async () => {
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

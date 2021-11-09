import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'

import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import ManagementRegime from '../ManagementRegime'
import { getMockDexieInstanceAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

test('Management Regime component renders with the expected UI elements', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/management-regimes/:managementRegimeId">
      <ManagementRegime />
    </Route>,
    {
      initialEntries: ['/projects/5/management-regimes/2'],
      dexieInstance,
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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/management-regimes/:managementRegimeId">
      <ManagementRegime />
    </Route>,
    {
      initialEntries: ['/projects/5/management-regimes/2'],
      dexieInstance,
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

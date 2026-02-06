import { expect, test } from "vitest";
import '@testing-library/jest-dom'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Site from './Site'

test('Edit Site page - Save button initially disabled, then enabled when form dirty', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites/:siteId" element={<Site isNewSite={false} />} />
    </Routes>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  const saveButton = await screen.findByTestId('save-button-site-form')
  expect(saveButton).toBeDisabled()

  const siteNameInput = await screen.findByTestId('name-input')
  await user.type(siteNameInput, 'updated name')

  expect(saveButton).toBeEnabled()
})

test('Edit Site page - Save button disabled and "Required" error valudation message displayed when site name is empty', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites/:siteId" element={<Site isNewSite={false} />} />
    </Routes>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  const siteNameInput = await screen.findByTestId('name-input')
  const countryInput = await screen.findByTestId('country-input')

  await user.clear(siteNameInput)
  await user.click(countryInput)

  await screen.findByTestId('name-validation')

  expect(await screen.findByTestId('save-button-site-form')).toBeDisabled()
})

test('Edit Site page - clear latitude or longitude inputs shows inline error validation message "This field is required"', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites/:siteId" element={<Site isNewSite={false} />} />
    </Routes>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  // Clear latitude input field => "Required" in validation message showed, Save button disabled
  const latitudeInput = screen.getByTestId('latitude-input')
  const countryInput = await screen.findByTestId('country-input')

  await user.clear(latitudeInput)
  await user.click(countryInput)

  await screen.findByTestId('latitude-validation')

  expect(await screen.findByTestId('save-button-site-form')).toBeDisabled()

  // insert a number to latitude input, "Required" in validation message disappeared, Save button enabled
  await user.type(latitudeInput, '12')

  await waitFor(() => expect(screen.getByTestId('save-button-site-form')).toBeEnabled())

  // Clear longitude input field => "Required" in validation message showed, Save button disabled
  const longitudeInput = screen.getByTestId('longitude-input')

  await user.clear(longitudeInput)
  await user.click(countryInput)

  await screen.findByTestId('longitude-validation')

  expect(await screen.findByTestId('save-button-site-form')).toBeDisabled()

  // insert a number to longitude input, "Required" in validation message disappeared, Save button enabled
  await user.type(longitudeInput, '20')

  await waitFor(() => expect(screen.getByTestId('save-button-site-form')).toBeEnabled())
})

test('Edit Site page - enter invalid inputs to latitude shows inline error validation message "latitude should be between -90° and 90°"', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites/:siteId" element={<Site isNewSite={false} />} />
    </Routes>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const latitudeInput = screen.getByTestId('latitude-input')
  const countryInput = screen.getByTestId('country-input')

  await user.clear(latitudeInput)
  await user.type(latitudeInput, '91')
  await user.click(countryInput)

  await screen.findByTestId('latitude-validation')

  expect(await screen.findByTestId('save-button-site-form')).toBeDisabled()

  await user.clear(latitudeInput)
  await user.type(latitudeInput, '20')
  await user.click(countryInput)

  await waitFor(() => expect(screen.getByTestId('save-button-site-form')).toBeEnabled())
})

test('Edit Site page - enter invalid inputs to longitude shows inline error validation message "longitude should be between -180° and 180°"', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)
  const user = userEvent.setup()

  renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/sites/:siteId" element={<Site isNewSite={false} />} />
    </Routes>,

    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const longitudeInput = screen.getByTestId('longitude-input')
  const countryInput = screen.getByTestId('country-input')

  await user.click(longitudeInput)
  await user.clear(longitudeInput)
  await user.type(longitudeInput, '181')
  await waitFor(() => expect(longitudeInput).toHaveValue(181))
  await user.click(countryInput)

  await screen.findByTestId('longitude-validation')

  expect(await screen.findByTestId('save-button-site-form')).toBeDisabled()

  await user.clear(longitudeInput)
  await user.type(longitudeInput, '20')
  await user.click(countryInput)

  await waitFor(() => expect(screen.getByTestId('save-button-site-form')).toBeEnabled())
})

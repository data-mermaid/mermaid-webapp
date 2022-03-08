import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Site from './Site'

test('Edit Site page - Save button initially disabled, then enabled when form dirty', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites/:siteId">
      <Site />
    </Route>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexieInstance,
      isSyncInProgressOverride: true,
    },
  )

  const saveButtonInit = await screen.findByRole('button', { name: 'Saved' })

  expect(saveButtonInit).toBeDisabled()

  const siteNameInput = screen.getByRole('textbox', { name: 'Name' })

  userEvent.type(siteNameInput, 'updated name')

  const saveButtonAfterFormDirty = await screen.findByRole('button', { name: 'Save' })

  expect(saveButtonAfterFormDirty).toBeEnabled()
})

test('Edit Site page - Save button disabled and "Required" error valudation message displayed when site name is empty', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites/:siteId">
      <Site />
    </Route>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexieInstance,
      isSyncInProgressOverride: true,
    },
  )

  const siteNameInput = await screen.findByRole('textbox', { name: 'Name' })

  userEvent.clear(siteNameInput)

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()
  expect(
    await within(screen.getByTestId('name')).findByText('This field is required'),
  ).toBeInTheDocument()
})

test('Edit Site page - clear latitude or longitude inputs shows inline error validation message "This field is required"', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites/:siteId">
      <Site />
    </Route>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexieInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  // Clear latitude input field => "Required" in validation message showed, Save button disabled
  const latitudeInput = screen.getByLabelText('Latitude')

  userEvent.clear(latitudeInput)

  expect(
    await within(screen.getByTestId('latitude')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // insert a number to latitude input, "Required" in validation message disappeared, Save button enabled
  userEvent.type(latitudeInput, '12')

  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()

  // Clear longitude input field => "Required" in validation message showed, Save button disabled
  const longitudeInput = screen.getByLabelText('Longitude')

  userEvent.clear(longitudeInput)

  expect(
    await within(screen.getByTestId('longitude')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // insert a number to longitude input, "Required" in validation message disappeared, Save button enabled
  userEvent.type(longitudeInput, '20')

  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

test('Edit Site page - enter invalid inputs to latitude shows inline error validation message "latitude should be between -90° and 90°"', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites/:siteId">
      <Site />
    </Route>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexieInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const latitudeInput = screen.getByLabelText('Latitude')

  userEvent.clear(latitudeInput)
  userEvent.type(latitudeInput, '91')

  expect(
    await within(screen.getByTestId('latitude')).findByText(
      'Latitude should be between -90° and 90°',
    ),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  userEvent.clear(latitudeInput)
  userEvent.type(latitudeInput, '20')

  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

test('Edit Site page - enter invalid inputs to longitude shows inline error validation message "longitude should be between -180° and 180°"', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/sites/:siteId">
      <Site />
    </Route>,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexieInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const longitudeInput = screen.getByLabelText('Longitude')

  userEvent.clear(longitudeInput)
  userEvent.type(longitudeInput, '181')

  expect(
    await within(screen.getByTestId('longitude')).findByText(
      'Longitude should be between -180° and 180°',
    ),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  userEvent.clear(longitudeInput)
  userEvent.type(longitudeInput, '20')

  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

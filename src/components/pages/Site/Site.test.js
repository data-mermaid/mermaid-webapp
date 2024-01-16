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
  within,
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

  const saveButtonInit = await screen.findByRole('button', { name: 'Saved' })

  expect(saveButtonInit).toBeDisabled()

  const siteNameInput = screen.getByRole('textbox', { name: 'Name' })

  await user.type(siteNameInput, 'updated name')

  const saveButtonAfterFormDirty = await screen.findByRole('button', { name: 'Save' })

  expect(saveButtonAfterFormDirty).toBeEnabled()
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

  const siteNameInput = await screen.findByRole('textbox', { name: 'Name' })
  const countryInput = await screen.findByRole('textbox', { name: 'Country' })

  await user.clear(siteNameInput)
  await user.click(countryInput)

  expect(
    await within(screen.getByTestId('name')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  // Clear latitude input field => "Required" in validation message showed, Save button disabled
  const latitudeInput = screen.getByLabelText('Latitude')
  const countryInput = await screen.findByRole('textbox', { name: 'Country' })

  await user.clear(latitudeInput)
  await user.click(countryInput)

  expect(
    await within(screen.getByTestId('latitude')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // insert a number to latitude input, "Required" in validation message disappeared, Save button enabled
  await user.type(latitudeInput, '12')

  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())

  // Clear longitude input field => "Required" in validation message showed, Save button disabled
  const longitudeInput = screen.getByLabelText('Longitude')

  await user.clear(longitudeInput)
  await user.click(countryInput)

  expect(
    await within(screen.getByTestId('longitude')).findByText('This field is required'),
  ).toBeInTheDocument()

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  // insert a number to longitude input, "Required" in validation message disappeared, Save button enabled
  await user.type(longitudeInput, '20')

  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const latitudeInput = screen.getByLabelText('Latitude')
  const countryInput = screen.getByLabelText('Country')

  await user.clear(latitudeInput)
  await user.type(latitudeInput, '91')
  await user.click(countryInput)

  await waitFor(() =>
    expect(
      within(screen.getByTestId('latitude')).getByText('Latitude should be between -90° and 90°'),
    ).toBeInTheDocument(),
  )

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  await user.clear(latitudeInput)
  await user.type(latitudeInput, '20')
  await user.click(countryInput)

  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
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

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const longitudeInput = screen.getByLabelText('Longitude')
  const countryInput = screen.getByLabelText('Country')

  await user.click(longitudeInput)
  await user.clear(longitudeInput)
  await user.type(longitudeInput, '181')
  await waitFor(() => expect(longitudeInput).toHaveValue(181))
  await user.click(countryInput)

  await waitFor(() =>
    expect(
      within(screen.getByTestId('longitude')).getByText(
        'Longitude should be between -180° and 180°',
      ),
    ).toBeInTheDocument(),
  )

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()

  await user.clear(longitudeInput)
  await user.type(longitudeInput, '20')
  await user.click(countryInput)

  await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
})

import '@testing-library/jest-dom'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

test('Offline: Edit Site shows toast and edited record info', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  await user.clear(siteNameInput)
  await user.type(siteNameInput, 'OOF')

  await user.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('The site has been saved on your computer.'))

  expect(siteNameInput).toHaveValue('OOF')
})

test('Online: Edit Site shows toast and edited record info', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  await user.clear(siteNameInput)
  await user.type(siteNameInput, 'OOF')

  await user.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('The site has been saved on your computer and online.'))

  await waitFor(() => expect(siteNameInput).toHaveValue('OOF'))
})

test('Offline: edit site save stored site in dexie', async () => {
  // hard to test this one online due to excessive mocking, so we will skip that
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  await user.clear(siteNameInput)
  await user.type(siteNameInput, 'OOF')

  await user.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('The site has been saved on your computer.'))

  const savedSites = await dexiePerUserDataInstance.project_sites.toArray()

  const updatedSite = savedSites.filter((record) => record.id === '1')[0]

  await waitFor(() => expect(updatedSite.name).toEqual('OOF'))
})
test('Offline: Edit site  save failure shows toast message with new edits persisting', async () => {
  const consoleSpy = jest.spyOn(console, 'error')

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)
  const dexieError = new Error('this is a dexie error')

  // make sure the next save will fail
  dexiePerUserDataInstance.project_sites.put = jest.fn().mockRejectedValueOnce(dexieError)

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  await user.clear(siteNameInput)
  await user.type(siteNameInput, 'OOF')

  await user.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByTestId('site-toast-error')).toHaveTextContent(
    `The site failed to save both on your computer and online.`,
  )
  expect(consoleSpy).toHaveBeenCalledWith(dexieError)

  expect(siteNameInput).toHaveValue('OOF')
})

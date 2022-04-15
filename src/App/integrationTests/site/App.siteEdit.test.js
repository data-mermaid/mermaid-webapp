import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

test('Offline: Edit Site shows toast and edited record info', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  userEvent.clear(siteNameInput)
  userEvent.type(siteNameInput, 'OOF')

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Site saved.'))

  expect(siteNameInput).toHaveValue('OOF')
})

test('Online: Edit Site shows toast and edited record info', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  userEvent.clear(siteNameInput)
  userEvent.type(siteNameInput, 'OOF')

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Site saved.'))

  expect(siteNameInput).toHaveValue('OOF')
})

test('Offline: edit site save stored site in dexie', async () => {
  // hard to test this one online due to excessive mocking, so we will skip that
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  userEvent.clear(siteNameInput)
  userEvent.type(siteNameInput, 'OOF')

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Site saved.'))

  const savedSites = await dexiePerUserDataInstance.project_sites.toArray()

  const updatedSite = savedSites.filter((record) => record.id === '1')[0]

  expect(updatedSite.name).toEqual('OOF')
})
test('Offline: Edit site  save failure shows toast message with new edits persisting', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  // make sure the next save will fail
  dexiePerUserDataInstance.project_sites.put = jest.fn().mockRejectedValueOnce()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <App
      dexiePerUserDataInstance={dexiePerUserDataInstance}
      dexieCurrentUserInstance={dexieCurrentUserInstance}
    />,
    {
      initialEntries: ['/projects/5/sites/1'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const siteNameInput = await screen.findByLabelText('Name')

  userEvent.clear(siteNameInput)
  userEvent.type(siteNameInput, 'OOF')

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Something went wrong. The site has not been saved.'))

  expect(siteNameInput).toHaveValue('OOF')
})

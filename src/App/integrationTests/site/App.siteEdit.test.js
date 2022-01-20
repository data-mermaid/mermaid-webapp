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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

  const siteNameInput = await screen.findByLabelText('Name')

  userEvent.clear(siteNameInput)
  userEvent.type(siteNameInput, 'OOF')

  userEvent.click(
    screen.getByText('Save', {
      selector: 'button',
    }),
  )

  expect(await screen.findByText('Site saved.'))

  const savedSites = await dexieInstance.project_sites.toArray()

  const updatedSite = savedSites.filter((record) => record.id === '1')[0]

  expect(updatedSite.name).toEqual('OOF')
})
test('Offline: Edit site  save failure shows toast message with new edits persisting', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  // make sure the next save will fail
  dexieInstance.project_sites.put = jest.fn().mockRejectedValueOnce()

  // make sure there is a site to edit in dexie
  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

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

test('Online: Save button initially disabled, then enabled when form dirty', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

  const getSaveButton = async () => screen.findByRole('button', { name: 'Save' })

  expect(await getSaveButton()).toBeDisabled()

  const siteNameInput = screen.getByRole('textbox', { name: 'Name' })

  userEvent.type(siteNameInput, 'updated name')

  expect(await getSaveButton()).toBeEnabled()
})

test('Online: Save button disabled when site name is empty', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/sites/1'],
    dexieInstance,
  })

  const siteNameInput = await screen.findByRole('textbox', { name: 'Name' })

  userEvent.clear(siteNameInput)

  expect(await screen.findByRole('button', { name: 'Save' })).toBeDisabled()
})

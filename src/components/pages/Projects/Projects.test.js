import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import SyncApiDataIntoOfflineStorage from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  renderAuthenticatedOffline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Projects from './Projects'

test('Projects component renders with the expected UI elements', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)
  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )
  // expect count of projects renders is the same as the count in mock data
  const projectList = screen.getByRole('list')

  const projectListItems = within(projectList).getAllByRole('listitem')

  expect(projectListItems).toHaveLength(5)

  // expect filter bar, sort buttons, new project button
  const newProjectButton = screen.getByRole('button', { name: 'New Project' })

  expect(newProjectButton).toBeInTheDocument()

  const filterBarLabel = screen.getByLabelText(
    'Filter Projects By Name or Country',
  )

  expect(filterBarLabel).toBeInTheDocument()

  const sortByLabel = screen.getByLabelText('Sort By')

  expect(sortByLabel).toBeInTheDocument()

  const sortButton = screen.getByRole('button', {
    name: 'sort-projects',
  })

  expect(sortButton).toBeInTheDocument()
})

test('A project card renders with the expected UI elements for button groups', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)
  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]
  // commented out for alpha, reactivate post alpha
  // const healthButton = within(projectCard).getByLabelText(/health/i)
  const collectButton = within(projectCard).getByLabelText(/collect/i)
  const dataButton = within(projectCard).getByLabelText(/data/i)
  const adminButton = within(projectCard).getByLabelText(/admin/i)
  // commented out for alpha, reactivate post alpha
  // const copyButton = within(projectCard).getByLabelText(/copy/i)

  // commented out for alpha, reactivate post alpha
  // expect(healthButton).toBeInTheDocument()
  expect(collectButton).toBeInTheDocument()
  expect(dataButton).toBeInTheDocument()
  expect(adminButton).toBeInTheDocument()
  // commented out for alpha, reactivate post alpha
  // expect(copyButton).toBeInTheDocument()
})

test('A project card shows relevant data for a project', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)
  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  expect(within(projectCard).getByText('Project I'))
  expect(within(projectCard).getByText('Canada'))
  expect(within(projectCard).getByText('13'))

  const offlineCheckbox = within(projectCard).getByRole('checkbox', {
    name: /offline ready/i,
  })

  expect(offlineCheckbox)
  expect(offlineCheckbox).toBeChecked()

  expect(
    within(projectCard).getByText(
      'Tue Jan 21 2020 00:00:00 GMT-0500 (Eastern Standard Time)',
    ),
  )
})

test('A project card renders appropriately when offline', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  renderAuthenticatedOffline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/collect/i),
    ).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/health/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/data/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/admin/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/copy/i),
    ).not.toBeInTheDocument(),
  )

  expect(screen.getByLabelText('Offline Ready')).toBeDisabled()
})

test('A project card renders appropriately when online', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/collect/i),
    ).toBeInTheDocument(),
  )
  // commented out for alpha, reactivate post alpha
  // await waitFor(() =>
  //   expect(within(projectCard).queryByLabelText(/health/i)).toBeInTheDocument(),
  // )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/data/i)).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/admin/i)).toBeInTheDocument(),
  )
  // commented out for alpha, reactivate post alpha
  // await waitFor(() =>
  //   expect(within(projectCard).queryByLabelText(/copy/i)).toBeInTheDocument(),
  // )

  const offlineReadyCheckboxes = screen.getAllByLabelText('Offline Ready')

  expect(offlineReadyCheckboxes[0]).toBeEnabled()
  expect(offlineReadyCheckboxes[1]).toBeEnabled()
  expect(offlineReadyCheckboxes[2]).toBeEnabled()
  expect(offlineReadyCheckboxes[3]).toBeEnabled()
  expect(offlineReadyCheckboxes[4]).toBeEnabled()
})

test('Hide new project button in project toolbar when offline', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexieInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
  })

  renderAuthenticatedOffline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexieInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(
      screen.queryByLabelText('projects list loading indicator'),
    ).not.toBeInTheDocument(),
  )

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'New Project' }),
    ).not.toBeInTheDocument(),
  )
})

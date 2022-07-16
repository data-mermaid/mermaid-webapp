import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import SyncApiDataIntoOfflineStorage from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { getFakeAccessToken } from '../../../testUtilities/getFakeAccessToken'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  renderAuthenticatedOffline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Projects from './Projects'

test('Projects component renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )
  // expect count of projects renders is the same as the count in mock data
  const projectList = screen.getByRole('list')

  const projectListItems = within(projectList).getAllByRole('listitem')

  expect(projectListItems).toHaveLength(5)

  // expect filter bar, sort buttons, new project button
  const newProjectButton = screen.getByRole('button', { name: 'New Project' })

  expect(newProjectButton).toBeInTheDocument()

  const filterBarLabel = screen.getByLabelText('Filter Projects By Name or Country')

  expect(filterBarLabel).toBeInTheDocument()

  const sortByLabel = screen.getByLabelText('Sort By')

  expect(sortByLabel).toBeInTheDocument()

  const sortButton = screen.getByRole('button', {
    name: 'sort-projects',
  })

  expect(sortButton).toBeInTheDocument()
})

test('A project card renders with the expected UI elements for button groups', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]
  const projectOverviewButton = within(projectCard).getByLabelText(/usersandtransects/i)
  const collectButton = within(projectCard).getByLabelText(/collect/i)
  const dataButton = within(projectCard).getByLabelText(/data/i)
  const adminButton = within(projectCard).getByLabelText(/admin/i)
  // commented out for alpha, reactivate post alpha
  // const copyButton = within(projectCard).getByLabelText(/copy/i)

  // commented out for alpha, reactivate post alpha
  expect(projectOverviewButton).toBeInTheDocument()
  expect(collectButton).toBeInTheDocument()
  expect(dataButton).toBeInTheDocument()
  expect(adminButton).toBeInTheDocument()
  // commented out for alpha, reactivate post alpha
  // expect(copyButton).toBeInTheDocument()
})

test('A project card shows relevant data for a project', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,

    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,

    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
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
    within(projectCard).getByText('Tue Jan 21 2020 00:00:00 GMT+0000 (Coordinated Universal Time)'),
  )
})

test('A project card renders appropriately when offline', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,

    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOffline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,

    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/usersandtransects/i)).not.toBeInTheDocument(),
  )
  await waitFor(() => expect(within(projectCard).queryByLabelText(/collect/i)).toBeInTheDocument())
  await waitFor(() => expect(within(projectCard).queryByLabelText(/data/i)).not.toBeInTheDocument())
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/admin/i)).not.toBeInTheDocument(),
  )
  await waitFor(() => expect(within(projectCard).queryByLabelText(/copy/i)).not.toBeInTheDocument())

  expect(screen.getByLabelText('Offline Ready')).toBeDisabled()
})

test('A project card renders appropriately when online', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/usersandtransects/i)).toBeInTheDocument(),
  )
  await waitFor(() => expect(within(projectCard).queryByLabelText(/collect/i)).toBeInTheDocument())
  await waitFor(() => expect(within(projectCard).queryByLabelText(/data/i)).toBeInTheDocument())
  await waitFor(() => expect(within(projectCard).queryByLabelText(/admin/i)).toBeInTheDocument())
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
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOffline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'New Project' })).not.toBeInTheDocument(),
  )
})

test('Projects can be sorted by countries', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const selectMenu = screen.getAllByRole('combobox')[0]

  userEvent.selectOptions(selectMenu, ['countries'])

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project II'))
  expect(within(topProjectCard).getByText('America'))
})

test('Projects can be sorted by number of sites', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const selectMenu = screen.getAllByRole('combobox')[0]

  userEvent.selectOptions(selectMenu, ['num_sites'])

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project IV'))
  expect(within(topProjectCard).getByText('9'))
})

test('Projects can be sorted by updated on date', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const selectMenu = screen.getAllByRole('combobox')[0]

  userEvent.selectOptions(selectMenu, ['updated_on'])

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project III'))
  expect(within(topProjectCard).getByText('Tue Jan 21 1992 08:00:00'))
})

test('Project sorted descending', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const sortProjects = screen.getByLabelText('sort-projects')

  userEvent.click(sortProjects)

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project V'))
})

test('Project filter filters by name and country', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const apiSyncInstance = new SyncApiDataIntoOfflineStorage({
    dexiePerUserDataInstance,
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    getAccessToken: getFakeAccessToken,
  })

  renderAuthenticatedOnline(<Projects apiSyncInstance={apiSyncInstance} />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const filterProjects = screen.getByRole('textbox', {
    name: /Filter Projects By Name or Country/i,
  })

  // Filter by name
  userEvent.type(filterProjects, '"Project V"')

  let projectCards = screen.getAllByRole('listitem')

  expect(projectCards.length).toEqual(1)
  expect(within(projectCards[0]).getByText('Project V'))

  // Filter by name and country
  userEvent.type(filterProjects, '{selectall}{del} "Project V" America')

  projectCards = screen.getAllByRole('listitem')

  expect(projectCards.length).toEqual(2)
})

import '@testing-library/jest-dom'
import React from 'react'

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

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectListItems = screen.getAllByTestId('project-card')

  expect(projectListItems).toHaveLength(6)

  // expect filter bar, sort buttons, new project button
  // const newProjectButton = screen.getByRole('button', { name: 'New Project' })
  const newProjectButton = screen.getByTestId('new-project')

  expect(newProjectButton).toBeInTheDocument()

  const filterProjectsSearchBar = screen.getByTestId('filter-projects')

  expect(filterProjectsSearchBar).toBeInTheDocument()

  const sortByDropdown = screen.getByTestId('sort-by')

  expect(sortByDropdown).toBeInTheDocument()
})

test('A project card renders with the expected UI elements for button groups', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]
  const collectingSummaryCard = within(projectCard).getByLabelText(/collect/i)
  const submitSummaryCard = within(projectCard).getByLabelText(/submitted/i)
  const sitesSummaryCard = within(projectCard).getByLabelText(/sites/i)
  const usersSummaryCard = within(projectCard).getByLabelText(/users/i)
  const dataSharingSummaryCard = within(projectCard).getByLabelText(/data-sharing/i)
  const copyButton = within(projectCard).getByLabelText(/copy/i)

  expect(collectingSummaryCard).toBeInTheDocument()
  expect(submitSummaryCard).toBeInTheDocument()
  expect(sitesSummaryCard).toBeInTheDocument()
  expect(usersSummaryCard).toBeInTheDocument()
  expect(dataSharingSummaryCard).toBeInTheDocument()
  expect(copyButton).toBeInTheDocument()
})

test('A project card shows relevant data for a project', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  const collectingSummaryCard = within(projectCard).getByLabelText(/collect/i)
  const submittedSummaryCard = within(projectCard).getByLabelText(/submitted/i)
  const sitesSummaryCard = within(projectCard).getByLabelText(/sites/i)
  const usersSummaryCard = within(projectCard).getByLabelText(/users/i)
  const dataSharingSummaryCard = within(projectCard).getByLabelText(/data-sharing/i)

  expect(within(projectCard).getByText('Project II'))
  expect(within(projectCard).getByText('America'))
  expect(within(collectingSummaryCard).getByText('32'))
  expect(within(submittedSummaryCard).getByText('2'))
  expect(within(sitesSummaryCard).getByText('36'))
  expect(within(usersSummaryCard).getByText('3'))
  expect(within(dataSharingSummaryCard).getByTestId('fishbelt-policy')).toHaveTextContent(
    'Fish belt: Public Summary',
  )
  expect(within(dataSharingSummaryCard).getByTestId('benthic-policy')).toHaveTextContent(
    'Benthic: Private',
  )
  expect(within(dataSharingSummaryCard).getByTestId('bleaching-policy')).toHaveTextContent(
    'Bleaching: Public',
  )

  const offlineCheckbox = within(projectCard).getByRole('checkbox', {
    name: /offline ready/i,
  })

  expect(offlineCheckbox)

  expect(within(projectCard).getByText('Thu Jan 21 2021 08:00:00'))
})

test('A project card renders appropriately when offline', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]
  const collectingSummaryCard = within(projectCard).getByLabelText(/collect/i)
  const submittedSummaryCard = within(projectCard).getByLabelText(/submitted/i)
  const sitesSummaryCard = within(projectCard).getByLabelText(/sites/i)
  const usersSummaryCard = within(projectCard).getByLabelText(/users/i)
  const dataSharingSummaryCard = within(projectCard).getByLabelText(/data-sharing/i)

  expect(within(projectCard).getByLabelText(/collect/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/submitted offline/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/sites/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/users offline/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/data-sharing offline/i)).toBeInTheDocument()
  expect(within(collectingSummaryCard).getByText('12'))
  expect(within(submittedSummaryCard).getByText('Online Only'))
  expect(within(sitesSummaryCard).getByText('13'))
  expect(within(usersSummaryCard).getByText('Online Only'))
  expect(within(dataSharingSummaryCard).getByText('Online Only'))

  expect(screen.getByLabelText('Offline Ready')).toBeDisabled()
  expect(screen.getByLabelText('Copy')).toBeDisabled()
})

test('A project card renders appropriately when online', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  expect(within(projectCard).getByLabelText(/collect/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/submitted/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/sites/i)).toBeInTheDocument()
  expect(within(projectCard).getByLabelText(/users/i)).toBeInTheDocument()
  // Talk to AL or Melissa as to why this is commented.
  // expect(within(projectCard).getByLabelText(/data sharing/i)).toBeInTheDocument()

  const offlineReadyCheckboxes = screen.getAllByLabelText('Offline Ready')
  const copyButtons = screen.getAllByLabelText('Copy')

  expect(offlineReadyCheckboxes[0]).toBeEnabled()
  expect(offlineReadyCheckboxes[1]).toBeEnabled()
  expect(offlineReadyCheckboxes[2]).toBeEnabled()
  expect(offlineReadyCheckboxes[3]).toBeEnabled()
  expect(offlineReadyCheckboxes[4]).toBeEnabled()

  expect(copyButtons[0]).toBeEnabled()
  expect(copyButtons[1]).toBeEnabled()
  expect(copyButtons[2]).toBeEnabled()
  expect(copyButtons[3]).toBeEnabled()
  expect(copyButtons[4]).toBeEnabled()
})

test('Hide new project button in project toolbar when offline', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<Projects />, {
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

  const { user } = renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const selectMenu = screen.getAllByRole('combobox')[0]

  await user.selectOptions(selectMenu, ['countries'])

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project II'))
  expect(within(topProjectCard).getByText('America'))
})

test('Projects can be sorted by updated on date', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const selectMenu = screen.getAllByRole('combobox')[0]

  await user.selectOptions(selectMenu, ['updated_on'])

  const topProjectCard = screen.getAllByRole('listitem')[0]

  expect(within(topProjectCard).getByText('Project II'))
  expect(within(topProjectCard).getByText('Thu Jan 21 2021 08:00:00'))
})

test('Project filter filters by name and country', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const filterProjectsSearchBar = screen.getByTestId('filter-projects')

  // Filter by name
  await user.type(filterProjectsSearchBar, '"Project V"')

  let projectCards = screen.getAllByTestId('project-card')

  expect(projectCards.length).toEqual(1)
  expect(within(projectCards[0]).getByText('Project V'))

  // Filter by name and country
  await user.type(filterProjectsSearchBar, '{selectall}{del} "Project V" America')

  projectCards = screen.getAllByTestId('project-card')

  expect(projectCards.length).toEqual(2)
})
test('Project filter can accomodate words containing apostrophes', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(<Projects />, {
    dexiePerUserDataInstance,
    isSyncInProgressOverride: true,
  })

  await waitFor(() =>
    expect(screen.queryByLabelText('projects list loading indicator')).not.toBeInTheDocument(),
  )

  const filterProjectsSearchBar = screen.getByTestId('filter-projects')

  // Filter by name
  await user.type(filterProjectsSearchBar, '"foo\'s"')

  const projectCards = screen.getAllByTestId('project-card')

  expect(projectCards.length).toEqual(1)
  expect(within(projectCards[0]).getByText("Project Z has an apostrophe foo's"))
})

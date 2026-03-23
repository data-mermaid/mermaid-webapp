import { describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  initiallyHydrateOfflineStorageWithMockData,
  initiallyHydrateOfflineStorageWithMockDataNoDemoProject,
} from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import Projects from '../../components/pages/Projects'

describe('Projects dashboard', () => {
  test('Projects component renders with the expected UI elements', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const projectListItems = screen.getAllByTestId('project-card')

    expect(projectListItems).toHaveLength(6)

    // expect filter bar, sort buttons, new project button
    // enable when project_demo feature is enabled
    // const newProjectButton = screen.getByTestId('new-project-button-dropdown')
    // expect(newProjectButton).toBeInTheDocument()

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
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const projectCard = screen.getAllByTestId('project-card')[1]
    const collectingSummaryCard = within(projectCard).getByTestId('collect-summary-card')
    const submitSummaryCard = within(projectCard).getByTestId('submitted-summary-card-online')
    const sitesSummaryCard = within(projectCard).getByTestId('sites-summary-card')
    const usersSummaryCard = within(projectCard).getByTestId('users-summary-card')
    const dataSharingSummaryCard = within(projectCard).getByTestId('data-sharing-summary-card')
    const copyButton = within(projectCard).getByTestId('copy-project-button')

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
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const projectCard = screen.getAllByTestId('project-card')[0]

    const collectingSummaryCard = within(projectCard).getByTestId('collect-summary-card')
    const submittedSummaryCard = within(projectCard).getByTestId('submitted-summary-card-online')
    const sitesSummaryCard = within(projectCard).getByTestId('sites-summary-card')
    const usersSummaryCard = within(projectCard).getByTestId('users-summary-card')
    const dataSharingSummaryCard = within(projectCard).getByTestId('data-sharing-summary-card')

    expect(within(projectCard).getByText('Project II'))
    expect(within(projectCard).getByText('America'))
    expect(within(collectingSummaryCard).getByText('32'))
    expect(within(submittedSummaryCard).getByText('2'))
    expect(within(sitesSummaryCard).getByText('36'))
    expect(within(usersSummaryCard).getByText('3'))
    expect(within(dataSharingSummaryCard).getByTestId('fishbelt-policy')).toBeInTheDocument()
    expect(within(dataSharingSummaryCard).getByTestId('benthic-policy')).toBeInTheDocument()
    expect(within(dataSharingSummaryCard).getByTestId('bleaching-policy')).toBeInTheDocument()

    const offlineCheckbox = within(projectCard).getByTestId('offline-ready')

    expect(offlineCheckbox)

    // expect(within(projectCard).getByText('Thu Jan 21 2021 08:00:00'))
  })

  test('A project card renders appropriately when offline', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const projectCard = screen.getAllByTestId('project-card')[0]
    const collectingSummaryCard = within(projectCard).getByTestId('collect-summary-card')
    const submittedSummaryCard = within(projectCard).getByTestId('submitted-summary-card-offline')
    const sitesSummaryCard = within(projectCard).getByTestId('sites-summary-card')
    const usersSummaryCard = within(projectCard).getByTestId('users-summary-card')
    const dataSharingSummaryCard = within(projectCard).getByTestId('data-sharing-summary-card')

    expect(within(projectCard).getByTestId('collect-summary-card')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('submitted-summary-card-offline')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('sites-summary-card')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('users-summary-card')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('data-sharing-summary-card')).toBeInTheDocument()
    expect(within(collectingSummaryCard).getByText('12'))
    expect(within(submittedSummaryCard).getByTestId('offline-message'))
    expect(within(sitesSummaryCard).getByText('13'))
    expect(within(usersSummaryCard).getByTestId('offline-message'))
    expect(within(dataSharingSummaryCard).getByTestId('offline-message'))

    expect(screen.getByTestId('offline-ready')).toBeDisabled()
    expect(screen.getByTestId('copy-project-button')).toBeDisabled()
  })

  test('A project card renders appropriately when online', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const projectCard = screen.getAllByTestId('project-card')[0]

    expect(within(projectCard).getByTestId('collect-summary-card')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('submitted-summary-card-online')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('sites-summary-card')).toBeInTheDocument()
    expect(within(projectCard).getByTestId('users-summary-card')).toBeInTheDocument()
    // Talk to AL or Melissa as to why this is commented.
    // expect(within(projectCard).getByTestId('data-sharing-summary-card')).toBeInTheDocument()

    const offlineReadyCheckboxes = screen.getAllByTestId('offline-ready')
    const copyButtons = screen.getAllByTestId('copy-project-button')

    expect(offlineReadyCheckboxes[0]).toBeEnabled()
    expect(offlineReadyCheckboxes[1]).toBeEnabled()
    expect(offlineReadyCheckboxes[2]).toBeEnabled()
    expect(offlineReadyCheckboxes[3]).toBeEnabled()
    expect(offlineReadyCheckboxes[4]).toBeEnabled()

    expect(copyButtons[0]).toBeEnabled()
    expect(copyButtons[1]).toBeEnabled()
    expect(copyButtons[2]).toBeEnabled()
    expect(copyButtons[3]).toBeEnabled()
    expect(copyButtons[4]).toBeDisabled() //demo project
  })

  test('Hide new project button in project toolbar when offline', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
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
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const selectMenu = screen.getAllByRole('combobox')[0]

    await user.selectOptions(selectMenu, ['countries'])

    const topProjectCard = screen.getAllByTestId('project-card')[0]

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
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const selectMenu = screen.getAllByRole('combobox')[0]

    await user.selectOptions(selectMenu, ['updated_on'])

    const topProjectCard = screen.getAllByTestId('project-card')[0]

    expect(within(topProjectCard).getByText('Project II'))
    // commented out due to inconsistent data loading between local and GH actions
    // expect(within(topProjectCard).getByText('Thu Jan 21 2021 00:00:00'))
  })

  test('Project filter filters by name and country', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
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

  test('Project filter can accommodate words containing apostrophes', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    const filterProjectsSearchBar = screen.getByTestId('filter-projects')

    // Filter by name
    await user.type(filterProjectsSearchBar, '"foo\'s"')

    const projectCards = screen.getAllByTestId('project-card')

    expect(projectCards.length).toEqual(1)
    expect(within(projectCards[0]).getByText("Project Z has an apostrophe foo's"))
  })

  // enable after the demo project feature flag has been released - or mock out the functionality
  // test('Online - Demo callout will show if the user does not have a demo project', async () => {
  //   const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  //
  //   await initiallyHydrateOfflineStorageWithMockDataNoDemoProject(dexiePerUserDataInstance)
  //
  //   renderAuthenticatedOnline(<Projects />, {
  //     dexiePerUserDataInstance,
  //     isSyncInProgressOverride: true,
  //   })
  //
  //   await waitFor(() =>
  //     expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
  //   )
  //
  //   expect(screen.getByTestId('demo-project-callout')).toBeInTheDocument()
  //   expect(screen.getByTestId('callout-close-button')).toBeInTheDocument()
  // })

  test('Online - Demo callout will NOT show if user has previously dismissed demo', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockDataNoDemoProject(dexiePerUserDataInstance)

    const userWithDismissedDemo = {
      id: 'fake-id',
      first_name: 'FakeFirstName',
      last_name: 'FakeLastName',
      full_name: 'FakeFirstName FakeLastName',
      projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
      collect_state: { hasUserDismissedDemo: true },
    }

    renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      currentUserOverride: userWithDismissedDemo,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    expect(screen.queryByTestId('demo-project-callout')).not.toBeInTheDocument()
  })

  // enable after the demo project feature flag has been released - or mock out the functionality
  // test('Online - Clicking the demo callout close button dismisses it and calls saveUserProfile', async () => {
  //   const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  //
  //   await initiallyHydrateOfflineStorageWithMockDataNoDemoProject(dexiePerUserDataInstance)
  //
  //   const mockSaveUserProfile = vi.fn()
  //   const userWithoutDismissedDemo = {
  //     id: 'fake-id',
  //     first_name: 'FakeFirstName',
  //     last_name: 'FakeLastName',
  //     full_name: 'FakeFirstName FakeLastName',
  //     projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
  //     collect_state: {},
  //   }
  //
  //   const { user } = renderAuthenticatedOnline(<Projects />, {
  //     dexiePerUserDataInstance,
  //     isSyncInProgressOverride: true,
  //     currentUserOverride: userWithoutDismissedDemo,
  //     saveUserProfileOverride: mockSaveUserProfile,
  //   })
  //
  //   await waitFor(() =>
  //     expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
  //   )
  //
  //   expect(screen.getByTestId('demo-project-callout')).toBeInTheDocument()
  //
  //   const closeButton = screen.getByTestId('callout-close-button')
  //   await user.click(closeButton)
  //
  //   // Verify callout is no longer visible
  //   expect(screen.queryByTestId('demo-project-callout')).not.toBeInTheDocument()
  //
  //   // Verify saveUserProfile was called with hasUserDismissedDemo: true
  //   expect(mockSaveUserProfile).toHaveBeenCalledTimes(1)
  //   expect(mockSaveUserProfile).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       collect_state: expect.objectContaining({
  //         hasUserDismissedDemo: true,
  //       }),
  //     }),
  //   )
  // })

  test('Online - Demo callout will NOT show if user already has a demo project', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    // The mock data includes a project with is_demo: true (Project Z id: '6')
    // This test validates that when user has a demo project, callout doesn't show
    const userWithoutDismissedDemo = {
      id: 'fake-id',
      first_name: 'FakeFirstName',
      last_name: 'FakeLastName',
      full_name: 'FakeFirstName FakeLastName',
      projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
      collect_state: {},
    }

    renderAuthenticatedOnline(<Projects />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      currentUserOverride: userWithoutDismissedDemo,
    })

    await waitFor(() =>
      expect(screen.queryByTestId('projects-loading-indicator')).not.toBeInTheDocument(),
    )

    // Mock data includes Project Z with is_demo: true (id: '6')
    // Since a demo project exists, the callout should NOT appear
    expect(screen.queryByTestId('demo-project-callout')).not.toBeInTheDocument()
  })
})

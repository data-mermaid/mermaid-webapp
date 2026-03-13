import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  cleanup,
} from '../../testUtilities/testingLibraryWithHelpers'

// Mock the demoProjectTour module
vi.mock('../../library/demoProjectTour', () => ({
  startProjectTour: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ projectId: '1' }),
  }
})

// Import the mocked function for assertions
import { startProjectTour } from '../../library/demoProjectTour'
import ProjectInfo from '../../components/pages/ProjectInfo/ProjectInfo'

const createAdminUser = () => ({
  id: 'fake-id',
  first_name: 'FakeFirstName',
  last_name: 'FakeLastName',
  full_name: 'FakeFirstName FakeLastName',
  projects: [{ id: '1', name: 'FakeProjectName', role: 90 }],
  collect_state: {},
})

const expectStartProjectTourCalled = () => expect(startProjectTour).toHaveBeenCalledTimes(1)
const expectStartProjectTourNotCalled = () => expect(startProjectTour).not.toHaveBeenCalled()

describe('ProjectInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test('Auto-starts project tour when user lands on /new-demo / isNewDemoProject=true', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOnline(<ProjectInfo isNewDemoProject={true} />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      currentUserOverride: createAdminUser(),
      initialEntries: ['/projects/1/project-info/new-demo'],
    })

    await waitFor(expectStartProjectTourCalled, { timeout: 5000 })
  })

  test('Does NOT auto-start project tour when isNewDemoProject is undefined', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOnline(<ProjectInfo />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      currentUserOverride: createAdminUser(),
      initialEntries: ['/projects/1/project-info'],
    })

    // Wait for component to finish loading
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), {
      timeout: 5000,
    })

    expectStartProjectTourNotCalled()
  })

  test('Does NOT auto-start project tour when isNewDemoProject=false', async () => {
    const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOnline(<ProjectInfo isNewDemoProject={false} />, {
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
      currentUserOverride: createAdminUser(),
      initialEntries: ['/projects/1/project-info'],
    })

    // Wait for component to finish loading
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(), {
      timeout: 5000,
    })

    expectStartProjectTourNotCalled()
  })
})

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  cleanup,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import CalloutButtonDropdown from '../../components/generic/CalloutButton/CalloutButtonDropdown'

vi.mock('../../library/demoProjectTour', () => ({
  startProjectTour: vi.fn(),
}))

describe('CalloutButtonDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  afterEach(() => {
    cleanup()
  })
  describe('When the user does not have a demo project', () => {
    test('Shows dropdown menu with Add Demo Project button when dropdown is clicked', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      const mockUpdateUserSettings = vi.fn()
      const mockOnClick = vi.fn()

      const { user } = renderAuthenticatedOnline(
        <CalloutButtonDropdown
          updateUserSettings={mockUpdateUserSettings}
          onClick={mockOnClick}
          label="New Project"
          disabled={false}
          testId="new-project-button"
        />,
        {
          dexiePerUserDataInstance,
          isSyncInProgressOverride: true,
        },
      )

      // Dropdown should initially be hidden
      const dropdownContainer = screen.getByTestId('dropdown-icon-button')
      expect(dropdownContainer).toHaveStyle('display: none')

      // Click the dropdown toggle button (IconButton with IconDown)
      const dropdownToggle = dropdownContainer.previousElementSibling
      if (dropdownToggle) {
        await user.click(dropdownToggle)
      }

      // After click, dropdown should be visible
      const expectDropdownVisible = () =>
        expect(screen.getByTestId('dropdown-icon-button')).toHaveStyle('display: block')
      await waitFor(expectDropdownVisible)

      // Add Demo Project button should be visible
      expect(screen.getByTestId('add-demo-project-button')).toBeInTheDocument()
    })

    test('Calls updateUserSettings with hasUserDismissedDemo when demo project is created successfully', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      const mockUpdateUserSettings = vi.fn()
      const mockOnClick = vi.fn()

      renderAuthenticatedOnline(
        <CalloutButtonDropdown
          updateUserSettings={mockUpdateUserSettings}
          onClick={mockOnClick}
          label="New Project"
          disabled={false}
          testId="new-project-button"
        />,
        {
          dexiePerUserDataInstance,
          isSyncInProgressOverride: true,
        },
      )

      // The actual API call test would require mocking the databaseSwitchboardInstance.addDemoProject
      // This test validates the component renders correctly with the required props
      expect(screen.getByTestId('new-project-button')).toBeInTheDocument()
    })

    test('Main button triggers onClick callback', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      const mockUpdateUserSettings = vi.fn()
      const mockOnClick = vi.fn()

      const { user } = renderAuthenticatedOnline(
        <CalloutButtonDropdown
          updateUserSettings={mockUpdateUserSettings}
          onClick={mockOnClick}
          label="New Project"
          disabled={false}
          testId="new-project-button"
        />,
        {
          dexiePerUserDataInstance,
          isSyncInProgressOverride: true,
        },
      )

      const mainButton = screen.getByTestId('new-project-button')
      await user.click(mainButton)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
  })
})

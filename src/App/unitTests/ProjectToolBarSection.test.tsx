import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectToolBarSection from '../../components/ProjectToolBarSection/ProjectToolBarSection'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { renderAuthenticatedOnline } from '../../testUtilities/testingLibraryWithHelpers'

describe('ProjectToolBarSection', () => {
  describe('A demo project does not exist', () => {
    it('users can add a demo project from the dropdown', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      renderAuthenticatedOnline(
        <ProjectToolBarSection
          projectFilter=""
          setProjectFilter={jest.fn()}
          projectSortKey=""
          setProjectSortKey={jest.fn()}
          setIsProjectSortAsc={jest.fn()}
          addProjectToProjectsPage={jest.fn()}
          handleExploreButtonClick={jest.fn()}
          userHasDemoProject={false}
        />,
        {
          dexiePerUserDataInstance,
          isSyncInProgressOverride: true,
        },
      )

      const dropdownButton = screen.getByTestId('dropdown-icon-button')
      expect(dropdownButton).toBeInTheDocument()
      userEvent.click(dropdownButton)

      const addDemoButton = await screen.getByTestId('add-demo-project-button')
      expect(addDemoButton).toBeInTheDocument()

      // todo: mock out handling XMLHTTPRequest
      // userEvent.click(addDemoButton)
      // expect(await screen.findByTestId('loading-indicator')).toBeInTheDocument()

      // expect - URL will navigate to 'Sites'
      // todo: mock out properly
      // ${apiBaseUrl}/projects/create_demo/
      // expect(mockedUseNavigate).toHaveBeenCalledTimes(1)
      // expect(mockedUseNavigate).toHaveBeenCalledWith(expect.stringMatching(/\/sites$/))
    })
  })
  describe('A demo project exists', () => {
    it('the demo project dropdown will not render', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      renderAuthenticatedOnline(
        <ProjectToolBarSection
          projectFilter=""
          setProjectFilter={jest.fn()}
          projectSortKey=""
          setProjectSortKey={jest.fn()}
          setIsProjectSortAsc={jest.fn()}
          addProjectToProjectsPage={jest.fn()}
          handleExploreButtonClick={jest.fn()}
          userHasDemoProject={true}
        />,
        {
          dexiePerUserDataInstance,
          isSyncInProgressOverride: true,
        },
      )
      expect(screen.getByTestId('new-project-button')).toBeInTheDocument()
      expect(screen.queryByTestId('dropdown-icon-button')).not.toBeInTheDocument()
    })
  })
})

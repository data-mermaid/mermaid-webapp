import { describe, expect, it } from 'vitest'
import React from 'react'
import { screen } from '@testing-library/react'
import ProjectToolBarSection from '../../components/ProjectToolBarSection/ProjectToolBarSection'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { renderAuthenticatedOnline } from '../../testUtilities/testingLibraryWithHelpers'

// enable when project_demo feature is enabled

describe('ProjectToolBarSection', () => {
  // describe('A demo project does not exist', () => {
  //   it('users can add a demo project from the dropdown', async () => {
  //     const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
  //     await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)
  //
  //     renderAuthenticatedOnline(
  //       <ProjectToolBarSection
  //         setProjectFilter={vi.fn()}
  //         projectSortKey=""
  //         setProjectSortKey={vi.fn()}
  //         setIsProjectSortAsc={vi.fn()}
  //         addProjectToProjectsPage={vi.fn()}
  //         handleExploreButtonClick={vi.fn()}
  //         userHasDemoProject={false}
  //       />,
  //       {
  //         dexiePerUserDataInstance,
  //         isSyncInProgressOverride: true,
  //       },
  //     )
  //
  //     const dropdownButton = screen.getByTestId('dropdown-icon-button')
  //     expect(dropdownButton).toBeInTheDocument()
  //     await userEvent.click(dropdownButton)
  //
  //     const addDemoButton = screen.getByTestId('add-demo-project-button')
  //     expect(addDemoButton).toBeInTheDocument()
  //
  //     // todo: mock out handling XMLHTTPRequest
  //     // userEvent.click(addDemoButton)
  //     // expect(await screen.findByTestId('loading-indicator')).toBeInTheDocument()
  //
  //     // expect - URL will navigate to 'Sites'
  //     // todo: mock out properly
  //     // ${apiBaseUrl}/projects/create_demo/
  //     // expect(mockedUseNavigate).toHaveBeenCalledTimes(1)
  //     // expect(mockedUseNavigate).toHaveBeenCalledWith(expect.stringMatching(/\/sites$/))
  //   })
  // })
  describe('A demo project exists', () => {
    it('the demo project dropdown will not render', async () => {
      const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()
      await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

      renderAuthenticatedOnline(
        <ProjectToolBarSection
          setProjectFilter={vi.fn()}
          projectSortKey=""
          setProjectSortKey={vi.fn()}
          setIsProjectSortAsc={vi.fn()}
          addProjectToProjectsPage={vi.fn()}
          handleExploreButtonClick={vi.fn()}
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

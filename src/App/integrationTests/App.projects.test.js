import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { renderAuthenticatedOffline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Clicking anywhere on a project card navigates to the project collect page when offline', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Collecting', {
      selector: 'h2',
    }),
  )
})
// commented out for alpha, reactivate post alpha
// test('Clicking anywhere on a project card navigates to the project health page when online', async () => {
//   renderAuthenticatedOnline(
//     <App />,
//   )

//   expect(
//     await screen.findByText('Projects', {
//       selector: 'h1',
//     }),
//   )

//   const projectCard = screen.getAllByRole('listitem')[0]

//   userEvent.click(projectCard)

//   expect(
//     await screen.findByText('Project Health', {
//       selector: 'h2',
//     }),
//   )
// })

test('Offline projects page only shows offline ready projects', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  // this includes marking one project as offline ready imperatively
  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(<App />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const projects = await screen.findAllByRole('listitem')

  // if all were shown, there would be 5, not 1
  expect(projects.length).toEqual(1)
})

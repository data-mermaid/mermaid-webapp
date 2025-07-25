import '@testing-library/jest-dom'

import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { renderAuthenticatedOffline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Clicking anywhere on a project card navigates to the project collect page when offline', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  expect(screen.getByTestId('projects-link')).toBeInTheDocument()

  const projectCards = await screen.findAllByRole('listitem')

  const projectCard = projectCards[0]

  await user.click(projectCard)

  expect(
    await screen.findByText('Collecting', {
      selector: 'h2',
    }),
  ).toBeInTheDocument()
})
// commented out for alpha, reactivate post alpha
// test('Clicking anywhere on a project card navigates to the project health page when online', async () => {
//   renderAuthenticatedOnline(
//     <App dexieInstance={getMockDexieInstancesAllSuccess()} />,
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

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const projects = await screen.findAllByRole('listitem')

  // if all were shown, there would be 5, not 1
  expect(projects.length).toEqual(1)
})

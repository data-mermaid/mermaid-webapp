import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { initiallyHydrateOfflineStorageWithMockData } from '../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Clicking anywhere on a project card navigates to the project collect page when offline', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    dexieInstance,
  })

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Collect Records', {
      selector: 'h2',
    }),
  )
})
// commented out for alpha, reactivate post alpha
// test('Clicking anywhere on a project card navigates to the project health page when online', async () => {
//   renderAuthenticatedOnline(
//     <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
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
  const dexieInstance = getMockDexieInstanceAllSuccess()

  // this includes marking one project as offline ready imperatively
  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOffline(<App dexieInstance={dexieInstance} />, {
    dexieInstance,
  })

  const projects = await screen.findAllByRole('listitem')

  // if all were shown, there would be 5, not 1
  expect(projects.length).toEqual(1)
})

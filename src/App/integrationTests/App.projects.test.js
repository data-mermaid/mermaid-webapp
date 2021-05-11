import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('Clicking anywhere on a project card navigates to the project collect page when offline', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Collect Records', {
      selector: 'h3',
    }),
  )
})

test('Clicking anywhere on a project card navigates to the project health page when online', async () => {
  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Project Health', {
      selector: 'h3',
    }),
  )
})

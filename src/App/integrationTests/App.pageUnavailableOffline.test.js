import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Route } from 'react-router-dom'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('App renders show page unavailable offline when navigate to Project Health page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/health'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Submitted page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/data'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Graphs and Maps page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/graphs-and-maps'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Admin page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/admin'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Users page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/users'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Fish Families page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/fish-families'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

test('App renders show page unavailable offline when navigate to Data Sharing page while offline.', async () => {
  renderAuthenticatedOffline(
    <Route>
      <App dexieInstance={getMockDexieInstanceAllSuccess()} />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/data-sharing'] },
  )

  expect(await screen.findByText(/this page is unavailable when offline/i))
})

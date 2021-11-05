import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

// this test suite is broken up into two for performance reasons

test('App renders show page unavailable offline when navigate to Project Health page while offline.', async () => {
  renderAuthenticatedOffline(<App dexieInstance={getMockDexieInstanceAllSuccess()} />, {
    initialEntries: ['/projects/5/health'],
  })

  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Submitted page while offline.', async () => {
  renderAuthenticatedOffline(<App dexieInstance={getMockDexieInstanceAllSuccess()} />, {
    initialEntries: ['/projects/5/data'],
  })
  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Graphs and Maps page while offline.', async () => {
  renderAuthenticatedOffline(<App dexieInstance={getMockDexieInstanceAllSuccess()} />, {
    initialEntries: ['/projects/5/graphs-and-maps'],
  })

  expect(await screen.findByText('This page is unavailable when offline'))
})

test('App renders show page unavailable offline when navigate to Admin page while offline.', async () => {
  renderAuthenticatedOffline(<App dexieInstance={getMockDexieInstanceAllSuccess()} />, {
    initialEntries: ['/projects/5/admin'],
  })

  expect(await screen.findByText('This page is unavailable when offline'))
})

import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  screen,
  renderAuthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

// this test suite is broken up into two for performance reasons

test('App renders show page unavailable offline when navigate to Project Health page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/observers-and-transects'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text'))
})

test('App renders show page unavailable offline when navigate to Submitted page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/submitted'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  expect(await screen.findByTestId('submitted-page-offline'))
})

test('App renders show page unavailable offline when navigate to Graphs and Maps page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/graphs-and-maps'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text'))
})

test('App renders show page unavailable offline when navigate to Project Info page while offline.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/project-info'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('page-unavailable-main-text'))
})

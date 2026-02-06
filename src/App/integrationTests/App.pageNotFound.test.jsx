import { expect, test } from "vitest";
import '@testing-library/jest-dom'
import React from 'react'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import { screen, renderAuthenticatedOnline } from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('App renders shows page not found when navigate to unknown path.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/thisRouteDoesNotExist'] },
    { dexiePerUserDataInstance, dexieCurrentUserInstance },
  )

  expect(await screen.findByText(/This page cannot be found./i))
})

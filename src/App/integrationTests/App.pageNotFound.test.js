import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { Route } from 'react-router-dom'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import { screen, renderAuthenticatedOnline } from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

test('App renders shows page not found when navigate to unknown path.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(
    <Route>
      <App
        dexiePerUserDataInstance={dexiePerUserDataInstance}
        dexieCurrentUserInstance={dexieCurrentUserInstance}
      />
    </Route>,
    { initialEntries: ['/thisRouteDoesNotExist'] },
    { dexiePerUserDataInstance, dexieCurrentUserInstance },
  )

  expect(await screen.findByText(/This page can't be found./i))
})

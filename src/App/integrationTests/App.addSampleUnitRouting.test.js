import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

test('Clicking Add Sample Unit then click Fish Belt link expects to see New Fish Belt page.', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    initialEntries: ['/projects/5/collecting'],
    dexieInstance,
  })

  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: /fish belt/i,
    }),
  )

  const newFishBeltTitle = await screen.findByText('Fish Belt', {
    selector: 'h2',
  })

  expect(newFishBeltTitle).toBeInTheDocument()
})

import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
// import { Route } from 'react-router-dom'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  // waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
// import mockOnlineDatabaseSwitchboardInstance from '../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
// import Collect from '../../components/pages/Collect'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('Clicking Add Sample Unit then click Fish Belt link expects to see New Fish Belt page.', async () => {
  const navigateToNewFishbeltFormFromCollecting = async () => {
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
  }

  // this one below doesn't work!
  // renderAuthenticatedOnline(
  //   <Collect
  //     databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
  //   />,
  //   { initialEntries: ['/projects/fakewhatever/collecting'] },
  // )

  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(within(projectCard).getByText(/collecting/i))

  await navigateToNewFishbeltFormFromCollecting()

  const newFishBeltTitle = await screen.findByText('Fish Belt', {
    selector: 'h2',
  })

  expect(newFishBeltTitle).toBeInTheDocument()
})

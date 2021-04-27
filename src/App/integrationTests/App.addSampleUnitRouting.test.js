import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Route } from 'react-router-dom'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockOnlineDatabaseSwitchboardInstance from '../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import Collect from '../../components/pages/Collect'
import FishBelt from '../../components/pages/FishBelt'

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
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting">
      <Collect
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const hideShowButton = screen.getByTestId('add-sample-unit')

  const addSampleUnitButton = within(hideShowButton).getByRole('button', {
    name: 'Add Sample Unit',
  })

  expect(addSampleUnitButton)

  userEvent.click(addSampleUnitButton)

  const fishBeltLink = await within(hideShowButton).findByRole('link', {
    name: 'Fish Belt',
  })

  expect(fishBeltLink).toBeInTheDocument()
  userEvent.click(fishBeltLink)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        isNewRecord
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  // the line below doesn't work yet.
  expect(screen.getByText('Fish Belt', { selector: 'h2' }))
})

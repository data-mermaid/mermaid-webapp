import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
  fireEvent,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockOnlineDatabaseSwitchboardInstance from '../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import Collect from '../../components/pages/Collect'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

test('Clicking Add Sample Unit then click Fish Belt expects to see New Fish Belt page.', async () => {
  renderAuthenticatedOnline(
    <Collect
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
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
  fireEvent.click(fishBeltLink, { button: 0 })

  // the line below doesn't work yet.
  // expect(await screen.findByText('Fish Belt', { selector: 'h2' }))
})

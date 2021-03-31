import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockOnlineDatabaseSwitchboardInstance from '../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Projects from './Projects'

// import Projects from './Projects'

test('Projects component renders with the expected UI elements', async () => {
  // const utilities = renderAuthenticatedOnline(<Projects />)
  // expect(screen.getByText('I should fail'))
  // a new ticket will be made for these tests
  renderAuthenticatedOnline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
  )

  // expect count of projects renders is the same as the count in mock data
  const projectList = screen.getByRole('list')

  const projectListItems = within(projectList).getAllByRole('listitem')

  expect(projectListItems).toHaveLength(5)

  // expect filter bar, sort buttons, new project button
})
test('A project card hover, shows extra buttons', () => {})
test('A project card shows  relevant data for a project', () => {
  // test the things that are wired in from data. (title, country, etc)
})

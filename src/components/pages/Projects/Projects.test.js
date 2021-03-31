import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockOnlineDatabaseSwitchboardInstance from '../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
  fireEvent,
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
  const newProjectButton = screen.getByRole('button', { name: 'New Project' })

  expect(newProjectButton).toBeInTheDocument()

  const filterBarLabel = screen.getByLabelText(
    'Filter Projects By Name or Country',
  )

  expect(filterBarLabel).toBeInTheDocument()

  const sortByLabel = screen.getByLabelText('Sort By')

  expect(sortByLabel).toBeInTheDocument()

  const sortButton = screen.getByRole('button', {
    name: 'sort-projects',
  })

  expect(sortButton).toBeInTheDocument()
})

test('A project card hover, shows extra buttons', () => {})
test('A project card shows  relevant data for a project', () => {
  // test the things that are wired in from data. (title, country, etc)
})

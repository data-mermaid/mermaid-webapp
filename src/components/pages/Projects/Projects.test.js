import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockOnlineDatabaseSwitchboardInstance from '../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'
import {
  renderAuthenticatedOnline,
  renderAuthenticatedOffline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import Projects from './Projects'

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
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
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

test('A project card renders with the expected UI elements for button groups', async () => {
  renderAuthenticatedOnline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  const healthButton = within(projectCard).getByLabelText(/health/i)
  const collectButton = within(projectCard).getByLabelText(/collect/i)
  const dataButton = within(projectCard).getByLabelText(/data/i)
  const adminButton = within(projectCard).getByLabelText(/admin/i)
  const copyButton = within(projectCard).getByLabelText(/copy/i)

  expect(healthButton).toBeInTheDocument()
  expect(collectButton).toBeInTheDocument()
  expect(dataButton).toBeInTheDocument()
  expect(adminButton).toBeInTheDocument()
  expect(copyButton).toBeInTheDocument()
})

test('A project card shows relevant data for a project', async () => {
  // test the things that are wired in from data. (title, country, etc)
  renderAuthenticatedOnline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  expect(within(projectCard).getByText('Project I'))
  expect(within(projectCard).getByText('Canada'))
  expect(within(projectCard).getByText('13 sites'))

  const offlineCheckbox = within(projectCard).getByRole('checkbox', {
    name: /offline ready/i,
  })

  expect(offlineCheckbox)
  expect(offlineCheckbox).toBeChecked()

  expect(within(projectCard).getByText('Updated: 01/21/2020'))
})

test('A project card shows only collect button in button groups when offline', async () => {
  renderAuthenticatedOffline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/collect/i),
    ).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/health/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/data/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/admin/i),
    ).not.toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/copy/i),
    ).not.toBeInTheDocument(),
  )
})

test('A project card shows all buttons in button group when online', async () => {
  renderAuthenticatedOnline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  await waitFor(() =>
    expect(
      within(projectCard).queryByLabelText(/collect/i),
    ).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/health/i)).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/data/i)).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/admin/i)).toBeInTheDocument(),
  )
  await waitFor(() =>
    expect(within(projectCard).queryByLabelText(/copy/i)).toBeInTheDocument(),
  )
})

test('Hide new project button in project toolbar when offline', async () => {
  renderAuthenticatedOffline(
    <Projects
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(
      screen.queryByLabelText('loading indicator'),
    ).not.toBeInTheDocument(),
  )

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'New Project' }),
    ).not.toBeInTheDocument(),
  )
})

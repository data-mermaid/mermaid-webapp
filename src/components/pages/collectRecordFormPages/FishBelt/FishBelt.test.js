import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import {
  renderAuthenticatedOnline,
  renderAuthenticatedOffline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import mockOnlineDatabaseSwitchboardInstance from '../../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'

import FishBelt from './FishBelt'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
}

test('FishBelt component in EDIT mode renders with the expected UI elements', async () => {
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        isNewRecord={false}
        currentUser={fakeCurrentUser}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('FB-2'))

  expect(
    screen.getByText('Sample Info', {
      selector: 'h2',
    }),
  )
  expect(
    screen.getByText('Transect', {
      selector: 'h2',
    }),
  )

  expect(screen.getByLabelText('Site'))
  expect(screen.getByLabelText('Management'))
  expect(screen.getByLabelText('Depth'))
  expect(screen.getByLabelText('Sample Date'))
  expect(screen.getByLabelText('Sample Time'))
  expect(screen.getByLabelText('Transect Number'))
  expect(screen.getByLabelText('Label'))
  expect(screen.getByLabelText('Transect Length Surveyed'))
  expect(screen.getByLabelText('Width'))
  expect(screen.getByLabelText('Fish Size Bin'))
  expect(screen.getByLabelText('Reef Slope'))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeEnabled()
})

test('FishBelt component in CREATE NEW mode renders with the expected UI elements', async () => {
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        currentUser={fakeCurrentUser}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  expect(
    screen.getByText('Fish Belt', {
      selector: 'h2',
    }),
  )

  expect(
    screen.getByText('Sample Info', {
      selector: 'h2',
    }),
  )
  expect(
    screen.getByText('Transect', {
      selector: 'h2',
    }),
  )

  expect(screen.getByLabelText('Site'))
  expect(screen.getByLabelText('Management'))
  expect(screen.getByLabelText('Depth'))
  expect(screen.getByLabelText('Sample Date'))
  expect(screen.getByLabelText('Sample Time'))
  expect(screen.getByLabelText('Transect Number'))
  expect(screen.getByLabelText('Label'))
  expect(screen.getByLabelText('Transect Length Surveyed'))
  expect(screen.getByLabelText('Width'))
  expect(screen.getByLabelText('Fish Size Bin'))
  expect(screen.getByLabelText('Reef Slope'))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeDisabled()
})

test('FishBelt component in EDIT mode - form inputs are initialized with the correct values', async () => {
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        isNewRecord={false}
        currentUser={fakeCurrentUser}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  // Site select
  expect(screen.getByDisplayValue('Site D'))
  // Management select
  expect(screen.getByDisplayValue('Management Regimes C'))
  expect(screen.getByLabelText('Depth')).toHaveValue(10)
  expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-03-02')
  expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
  expect(screen.getByLabelText('Transect Number')).toHaveValue(2)
  expect(screen.getByLabelText('Label')).toHaveValue('FB-2')
  expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(6)
  // width select
  expect(screen.getByDisplayValue('2m'))
  // fish size bin select
  expect(screen.getByDisplayValue(5))
  // reef slope select
  expect(screen.getByDisplayValue('flat'))
  expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')
})

test('FishBelt component in EDIT mode - button group shows save, validate and submit buttons when online', async () => {
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        isNewRecord={false}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const collectButtonGroups = screen.getByTestId('fishbelt-form-buttons')
  const saveButton = within(collectButtonGroups).getByRole('button', {
    name: 'Save',
  })

  const validateButton = within(collectButtonGroups).getByRole('button', {
    name: 'Validate',
  })

  const submitButton = within(collectButtonGroups).getByRole('button', {
    name: 'Validate',
  })

  expect(saveButton).toBeInTheDocument()
  expect(validateButton).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})

test('FishBelt component in EDIT mode - button group shows only save button when offline', async () => {
  renderAuthenticatedOffline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
        isNewRecord={false}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  const collectButtonGroups = screen.getByTestId('fishbelt-form-buttons')
  const saveButton = within(collectButtonGroups).getByRole('button', {
    name: 'Save',
  })

  const validateButton = within(collectButtonGroups).queryByRole('button', {
    name: 'Validate',
  })

  const submitButton = within(collectButtonGroups).queryByRole('button', {
    name: 'Validate',
  })

  expect(saveButton).toBeInTheDocument()
  expect(validateButton).not.toBeInTheDocument()
  expect(submitButton).not.toBeInTheDocument()
})

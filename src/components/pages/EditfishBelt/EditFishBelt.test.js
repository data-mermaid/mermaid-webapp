import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../testUtilities/testingLibraryWithHelpers'
import mockOnlineDatabaseSwitchboardInstance from '../../../testUtilities/mockOnlineDatabaseSwitchboardInstance'

import EditFishBelt from './EditFishBelt'

test('EditFishBelt component renders with the expected UI elements', async () => {
  renderAuthenticatedOnline(
    <EditFishBelt
      databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
    />,
  )

  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
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
})

test('EditFishBelt form inputs are initialized with the correct values', async () => {
  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <EditFishBelt
        databaseSwitchboardInstance={mockOnlineDatabaseSwitchboardInstance}
      />
    </Route>,
    { initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'] },
  )

  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
  )

  // Site select
  expect(screen.getByDisplayValue('Karang Kapal'))
  // Management select
  expect(screen.getByDisplayValue('Bureta tabu'))
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

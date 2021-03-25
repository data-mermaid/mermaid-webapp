import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import mockOnlineMermaidDatabaseGatewayInstance from '../../../testUtilities/mockOnlineMermaidDatabaseGatewayInstance'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../testUtilities/testingLibraryWithHelpers'

import EditFishBelt from './EditFishBelt'

test('EditFishBelt component renders with the expected UI elements', async () => {
  renderAuthenticatedOnline(
    <EditFishBelt
      databaseGatewayInstance={mockOnlineMermaidDatabaseGatewayInstance}
    />,
  )
  // adding comments for testing demo, please remove them before merging to develop

  // this test asserts that the loading indicator is gone. Its less about testing the loading indicator,
  // and more about testing that the test run is unblocked to complete the rest of this test
  // in other words its just to make sure the component is ready for the rest of the test to proceed
  await waitFor(() =>
    expect(screen.queryByLabelText('loading indicator')).toBeNull(),
  )

  // testing the table headers existing might be overkill when
  // thinking about where to prioritize your testing time, but its also easy and good for a demo.

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
  // specifying that the above text is an h2 might be overkill,
  // but it also protects against a fragile test that fails if someone adds the text 'sample info' to a nav menu for example
  // its also in implementation detail territory, but also not. Im thinking header hierarchy is a user focused approach, because it is informational architecture
  // I think while expect(screen.getByText('Sample Info')) is a bit more fragile, its also good enough, and easier to get started with if you want.

  // in this test we are testing that the important deal breaking elements are displayed
  expect(screen.getByLabelText('Site'))
  // (getByLabelText selects the input associated with a label or one that has aria-label specified)
  // add assertions for the rest of the inputs here
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
  // ive got to run, and will finish these later (likely tomorrow, less likely tonight)
  // for now you can work on the above test (not explicitly in the ticket, but related)
})

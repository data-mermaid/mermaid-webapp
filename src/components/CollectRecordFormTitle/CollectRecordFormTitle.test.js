import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import CollectRecordFormTitle from './CollectRecordFormTitle'

test('CollectRecordFormTitle component renders with the expected UI elements.', () => {
  const mockCollectRecordData = {
    protocol: 'fishbelt',
    sample_event: {
      site: '4',
    },
    fishbelt_transect: {
      label: 'FB-2',
      number: 2,
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecordData={mockCollectRecordData}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByLabelText(/collect form title/i))
})

test('CollectRecordFormTitle component renders with missing label props and shows a default title.', () => {
  const mockMissingLabelData = {
    protocol: 'fishbelt',
    sample_event: {},
    fishbelt_transect: {},
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecordData={mockMissingLabelData}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Fish Belt'))
})

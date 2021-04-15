import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import CollectRecordFormTitle from './CollectRecordFormTitle'

test('CollectRecordFormTitle shows the title as expected when all of site name, transect number, and label are available', () => {
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

  expect(screen.getByText('Karang Kapal - 2 - FB-2'))
})

test('CollectRecordFormTitle component renders a default title when site name, transect number, and label are unavailable', () => {
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

test('CollectRecordFormTitle component renders properly when site name is missing.', () => {
  const mockMissingSiteCollectRecordData = {
    protocol: 'fishbelt',
    sample_event: {},
    fishbelt_transect: {
      label: 'FB-2',
      number: 2,
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecordData={mockMissingSiteCollectRecordData}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('2 - FB-2'))
})

test('CollectRecordFormTitle component renders properly when label is missing.', () => {
  const mockMissingLabelCollectRecordData = {
    protocol: 'fishbelt',
    sample_event: {
      site: '4',
    },
    fishbelt_transect: {
      number: 2,
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecordData={mockMissingLabelCollectRecordData}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Karang Kapal - 2'))
})

test('CollectRecordFormTitle component renders properly when transect number is missing.', () => {
  const mockMissingTransectNumberCollectRecordData = {
    protocol: 'fishbelt',
    sample_event: {
      site: '4',
    },
    fishbelt_transect: {
      label: 'FB-2',
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecordData={mockMissingTransectNumberCollectRecordData}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Karang Kapal - FB-2'))
})

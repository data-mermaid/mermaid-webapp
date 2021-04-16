import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import CollectRecordFormTitle from './CollectRecordFormTitle'

test('CollectRecordFormTitle shows the title as expected when all of site name, transect number, and label are available', () => {
  const mockCollectRecord = {
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
      },
      fishbelt_transect: {
        label: 'FB-2',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecord={mockCollectRecord}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Site D - 2 - FB-2'))
})

test('CollectRecordFormTitle component renders a default title when site name, transect number, and label are unavailable', () => {
  const mockMissingSiteNameTransectNumberLabelCollectRecord = {
    data: { protocol: 'fishbelt', sample_event: {}, fishbelt_transect: {} },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecord={mockMissingSiteNameTransectNumberLabelCollectRecord}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Fish Belt'))
})

test('CollectRecordFormTitle component renders properly when site name is missing.', () => {
  const mockMissingSiteCollectRecord = {
    data: {
      protocol: 'fishbelt',
      sample_event: {},
      fishbelt_transect: {
        label: 'FB-2',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecord={mockMissingSiteCollectRecord}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('2 - FB-2'))
})

test('CollectRecordFormTitle component renders properly when label is missing.', () => {
  const mockMissingLabelCollectRecord = {
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
      },
      fishbelt_transect: {
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecord={mockMissingLabelCollectRecord}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Site D - 2'))
})

test('CollectRecordFormTitle component renders properly when transect number is missing.', () => {
  const mockMissingTransectNumberCollectRecord = {
    data: {
      protocol: 'fishbelt',
      sample_event: {
        site: '4',
      },
      fishbelt_transect: {
        label: 'FB-2',
      },
    },
  }

  renderAuthenticatedOnline(
    <CollectRecordFormTitle
      collectRecord={mockMissingTransectNumberCollectRecord}
      sites={mockMermaidData.sites}
    />,
  )

  expect(screen.getByText('Site D - FB-2'))
})

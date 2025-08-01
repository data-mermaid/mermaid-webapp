import '@testing-library/jest-dom'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import RecordFormTitle from './RecordFormTitle'

test('RecordFormTitle shows the title as expected when all of site name, transect number, and label are available', () => {
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
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="fishbelt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('FB-2'))
})

test('RecordFormTitle component renders a default title when site name, transect number, and label are unavailable', () => {
  const mockMissingSiteNameTransectNumberLabelCollectRecord = {
    data: { protocol: 'fishbelt', sample_event: {}, fishbelt_transect: {} },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={
        mockMissingSiteNameTransectNumberLabelCollectRecord.data
      }
      sites={mockMermaidData.project_sites}
      protocol="fishbelt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
})

test('RecordFormTitle component renders properly when site name is missing.', () => {
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
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockMissingSiteCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="fishbelt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('FB-2'))
})

test('RecordFormTitle component renders properly when label is missing.', () => {
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
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockMissingLabelCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="fishbelt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
})

test('RecordFormTitle component renders properly when transect number is missing.', () => {
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
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockMissingTransectNumberCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="fishbelt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('FB-2'))
})

test('RecordFormTitle displays Benthic PIT titles correctly', () => {
  const mockCollectRecord = {
    data: {
      sample_event: {
        site: '4',
      },
      benthic_transect: {
        label: 'label',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="benthicpit"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('label'))
})

test('RecordFormTitle displays Benthic Photo Quadrat titles correctly', () => {
  const mockCollectRecord = {
    data: {
      sample_event: {
        site: '4',
      },
      quadrat_transect: {
        label: 'label',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="benthicpqt"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('label'))
})

test('RecordFormTitle displays Benthic LIT titles correctly', () => {
  const mockCollectRecord = {
    data: {
      sample_event: {
        site: '4',
      },
      benthic_transect: {
        label: 'label',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="benthiclit"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('label'))
})

test('RecordFormTitle displays Habitat Complexity titles correctly', () => {
  const mockCollectRecord = {
    data: {
      sample_event: {
        site: '4',
      },
      benthic_transect: {
        label: 'label',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="habitatcomplexity"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('label'))
})

test('RecordFormTitle displays Bleaching titles correctly', () => {
  const mockCollectRecord = {
    data: {
      sample_event: {
        site: '4',
      },
      quadrat_collection: {
        label: 'label',
        number: 2,
      },
    },
  }

  renderAuthenticatedOnline(
    <RecordFormTitle
      submittedRecordOrCollectRecordDataProperty={mockCollectRecord.data}
      sites={mockMermaidData.project_sites}
      protocol="bleachingqc"
    />,
  )

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByTestId('protocol-tooltip')).toBeInTheDocument()
  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('label'))
})

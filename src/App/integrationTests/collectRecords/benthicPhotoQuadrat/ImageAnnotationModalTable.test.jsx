import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ImageAnnotationModalTable from '../../../../components/pages/ImageClassification/ImageAnnotationModal/ImageAnnotationModalTable'

test('Unclassified points show up last in the modal observation table', () => {
  const mockPoints = [
    {
      id: 1,
      annotations: [{ ba_gr: 'classified_1', ba_gr_label: 'Classified 1', is_confirmed: true }],
    },
    {
      id: 2,
      annotations: [],
    },
    {
      id: 3,
      annotations: [{ ba_gr: 'classified_2', ba_gr_label: 'Classified 2', is_confirmed: false }],
    },
    {
      id: 3,
      annotations: [{ ba_gr: 'classified_2', ba_gr_label: 'Undaria humilis', is_confirmed: false }],
    },
  ]

  render(
    <ImageAnnotationModalTable
      points={mockPoints}
      setDataToReview={jest.fn()}
      selectedAttributeId=""
      setSelectedAttributeId={jest.fn()}
      setHoveredAttributeId={jest.fn()}
      setIsDataUpdatedSinceLastSave={jest.fn()}
      zoomToPointsByAttributeId={jest.fn()}
      isTableShowing={true}
    />,
  )

  const rows = screen.getAllByRole('row')
  const lastRow = rows[rows.length - 1]

  expect(lastRow).toHaveTextContent('Unclassified')
})

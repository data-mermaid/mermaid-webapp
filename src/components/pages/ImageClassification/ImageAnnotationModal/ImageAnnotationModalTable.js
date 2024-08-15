import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'

const TrWithBorderStyling = styled(Tr)`
  border: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.current}`};

  &:hover {
    border: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.highlighted}`};
  }
`

const ImageAnnotationModalTable = ({ points, setHighlightedPoints, setSelectedPoints }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState()
  const tableData = Object.groupBy(points, ({ annotations }) => annotations[0].label_display)

  const handleRowSelect = (rowData, index) => {
    if (index === selectedRowIndex) {
      setSelectedRowIndex()
      setSelectedPoints([])
    } else {
      setSelectedRowIndex(index)
      setSelectedPoints(rowData)
    }
  }

  return (
    <Table aria-labelledby="table-label">
      <thead>
        <Tr>
          <Th>Benthic Attribute</Th>
          <Th>Growth Form</Th>
          <Th align="right">Number of Points</Th>
          <Th />
          <Th />
        </Tr>
      </thead>
      <tbody>
        {Object.keys(tableData).map((row, i) => (
          <TrWithBorderStyling
            key={row}
            onClick={() => handleRowSelect(tableData[row], i)}
            onMouseEnter={() => setHighlightedPoints(tableData[row])}
            onMouseLeave={() => setHighlightedPoints([])}
            $isSelected={i === selectedRowIndex}
          >
            {/* TODO: These next two values are either going to be provided in dataToReview or we will need to lookup via API call (benthic attr - growth form) */}
            <Td>{row}</Td>
            <Td>{row}</Td>
            <Td align="right">{tableData[row].length}</Td>
            <Td align="center">
              <button>Confirm</button>
            </Td>
            <Td align="center">
              <button>x</button>
            </Td>
          </TrWithBorderStyling>
        ))}
      </tbody>
    </Table>
  )
}

ImageAnnotationModalTable.propTypes = {
  setHighlightedPoints: PropTypes.func.isRequired,
  setSelectedPoints: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired,
      annotations: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          label_display: PropTypes.string.isRequired,
          is_confirmed: PropTypes.bool.isRequired,
        }),
      ),
    }),
  ).isRequired,
}

export default ImageAnnotationModalTable

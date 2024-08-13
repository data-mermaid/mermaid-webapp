import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'

const ImageAnnotationModalTable = ({ dataToReview }) => {
  const tableData = Object.groupBy(
    dataToReview.points,
    ({ annotations }) => annotations[0].label_display,
  )

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
        {Object.keys(tableData).map((key) => (
          <Tr key={key}>
            {/* TODO: These next two values are either going to be provided in dataToReview or we will need to lookup via API call (benthic attr - growth form) */}
            <Td>{key}</Td>
            <Td>{key}</Td>
            <Td>{tableData[key].length}</Td>
            <Td>
              <button>Confirm</button>
            </Td>
            <Td>
              <button>x</button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}

ImageAnnotationModalTable.propTypes = {
  dataToReview: PropTypes.shape({
    image: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
}

export default ImageAnnotationModalTable

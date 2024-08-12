import React from 'react'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'

const ImageAnnotationModalTable = () => {
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
        <Tr>
          <Td>Galaxaura</Td>
          <Td>Branching</Td>
          <Td align="right">12</Td>
          <Td>
            <button>Confirm</button>
          </Td>
          <Td>
            <button>x</button>
          </Td>
        </Tr>
      </tbody>
    </Table>
  )
}

export default ImageAnnotationModalTable

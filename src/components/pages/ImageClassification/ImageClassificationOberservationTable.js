import React, { useState } from 'react'
import styled from 'styled-components'
import { H2 } from '../../generic/text'
import { InputWrapper } from '../../generic/form'
import {
  StyledOverflowWrapper,
  StickyObservationTable,
} from '../collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Th } from '../../generic/Table/table'
import ImageAnnotationModal from './ImageAnnotationModal'
import sampleData from './sample-data'
// import PropTypes from 'prop-types';

const StyledColgroup = styled('colgroup')`
  col {
    &.thumbnail {
      width: 5rem;
    }
    &.quadrat {
      width: 15rem;
    }
    &.benthicAttribute {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.numberOfPoints {
      width: 20rem;
    }
    &.validation {
      width: auto;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const tableHeaders = [
  { align: 'right', id: 'thumbnail-label', text: 'Thumbnail' },
  { align: 'right', id: 'quadrat-number-label', text: 'Quadrat' },
  { align: 'left', id: 'benthic-attribute-label', text: 'Benthic Attribute' },
  { align: 'right', id: 'growth-form-label', text: 'Growth Form' },
  { colSpan: 3, align: 'center', id: 'number-of-points-label', text: 'Number of Points' },
]

const TableHeaderRow = () => (
  <Tr>
    <Th />
    {tableHeaders.map((header) => (
      <Th key={header.id} align={header.align} id={header.id} colSpan={header.colSpan || 1}>
        <span>{header.text}</span>
      </Th>
    ))}
    <Th />
  </Tr>
)

const subHeaderColumns = [
  { align: 'center', text: 'Confirmed' },
  { align: 'center', text: 'Unconfirmed' },
  { align: 'center', text: 'Unknown' },
]

const SubHeaderRow = () => (
  <Tr>
    <Th colSpan={5} />
    {subHeaderColumns.map((col, index) => (
      <Th key={index} align={col.align}>
        <span>{col.text}</span>
      </Th>
    ))}
    <Th />
  </Tr>
)

const ImageClassificationObservationTable = () => {
  const [isModalDisplayed, setIsModalDisplayed] = useState(false)

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StickyObservationTable aria-labelledby="table-label">
            <StyledColgroup>
              <col className="number" />
              <col className="thumbnail" />
              <col className="quadrat" />
              <col className="benthicAttribute" />
              <col className="growthForm" />
              <col className="numberOfPoints" />
              {/* {areValidationsShowing && <col className="validations" />} */}
              <col className="remove" />
            </StyledColgroup>
            <thead>
              <TableHeaderRow />
              <SubHeaderRow />
            </thead>
            {/* <tbody>{observationsRows}</tbody> */}
          </StickyObservationTable>
        </StyledOverflowWrapper>
      </InputWrapper>
      <button onClick={() => setIsModalDisplayed(true)}>Temp button to open Modal</button>
      {isModalDisplayed ? (
        <ImageAnnotationModal setIsModalDisplayed={setIsModalDisplayed} data={sampleData} />
      ) : undefined}
    </>
  )
}

// ImageClassificationObservationTable.propTypes = {
//   areValidationsShowing: PropTypes.bool,
//   observationsRows: PropTypes.node,
// }

export default ImageClassificationObservationTable

import React from 'react'
import { H2 } from '../../generic/text'
import { InputWrapper } from '../../generic/form'
import {
  StyledOverflowWrapper,
  StickyObservationTable,
} from '../collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Th } from '../../generic/Table/table'
import PropTypes from 'prop-types'
import { StyledColgroup, StyledTd } from './ImageClassificationObservationTable.styles'
import { ButtonPrimary, ButtonCaution } from '../../generic/buttons'

const tableHeaders = [
  { align: 'right', id: 'number-label', text: '#' },
  { align: 'right', id: 'thumbnail-label', text: 'Thumbnail' },
  { align: 'right', id: 'quadrat-number-label', text: 'Quadrat' },
  { align: 'left', id: 'benthic-attribute-label', text: 'Benthic Attribute' },
  { align: 'right', id: 'growth-form-label', text: 'Growth Form' },
  { colSpan: 3, align: 'center', id: 'number-of-points-label', text: 'Number of Points' },
  { align: 'right', id: 'validations', text: 'Validations' },
  { align: 'right', id: 'review', text: '' },
  { align: 'right', id: 'remove', text: '' },
]

const TableHeaderRow = () => (
  <Tr>
    {tableHeaders.map((header) => (
      <Th key={header.id} align={header.align} id={header.id} colSpan={header.colSpan || 1}>
        <span>{header.text}</span>
      </Th>
    ))}
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
    <Th colSpan={4} />
  </Tr>
)

const ImageClassificationObservationTable = ({ uploadedFiles, handleRemoveFile }) => {
  return (
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
            <col className="confirmed" />
            <col className="unconfirmed" />
            <col className="unknown" />
            <col className="validations" />
            <col className="review" />
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <TableHeaderRow />
            <SubHeaderRow />
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <Tr key={index}>
                <StyledTd>{index + 1}</StyledTd>
                <StyledTd>{file.name}</StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd></StyledTd>
                <StyledTd>
                  <ButtonPrimary type="button">Review</ButtonPrimary>
                </StyledTd>
                <StyledTd>
                  <ButtonCaution type="button" onClick={() => handleRemoveFile(file)}>
                    x
                  </ButtonCaution>
                </StyledTd>
              </Tr>
            ))}
          </tbody>
        </StickyObservationTable>
      </StyledOverflowWrapper>
    </InputWrapper>
  )
}

ImageClassificationObservationTable.propTypes = {
  uploadedFiles: PropTypes.arrayOf(PropTypes.object),
  handleRemoveFile: PropTypes.func,
}

export default ImageClassificationObservationTable

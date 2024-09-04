import React, { useState } from 'react'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import {
  StyledOverflowWrapper,
  StickyObservationTable,
} from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Th } from '../../../generic/Table/table'
import PropTypes from 'prop-types'
import { StyledTd, TdWithHoverText } from './ImageClassificationObservationTable.styles'
import { ButtonPrimary, ButtonCaution } from '../../../generic/buttons'
import { IconClose } from '../../../icons'
import ImageAnnotationModal from '../ImageAnnotationModal/ImageAnnotationModal'
import Thumbnail from './Thumbnail'

const tableHeaders = [
  { align: 'right', id: 'number-label', text: '#' },
  { align: 'center', id: 'thumbnail-label', text: 'Thumbnail' },
  { align: 'right', id: 'status-label', text: 'Status' },
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
    <Th colSpan={6} />
    {subHeaderColumns.map((col, index) => (
      <Th key={index} align={col.align}>
        <span>{col.text}</span>
      </Th>
    ))}
    <Th colSpan={4} />
  </Tr>
)

const statusLabels = {
  0: 'Unknown',
  1: 'Pending',
  2: 'Running',
  3: 'Completed',
  4: 'Failed',
}

const ImageClassificationObservationTable = ({ uploadedFiles, handleRemoveFile }) => {
  const [imageId, setImageId] = useState()
  const isImageProcessed = (status) => status === 3

  const handleImageClick = (file) => {
    if (isImageProcessed(file.classification_status.status)) {
      return setImageId(file.id)
    } else {
      return
    }
  }

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StickyObservationTable aria-labelledby="table-label">
            <thead>
              <TableHeaderRow />
              <SubHeaderRow />
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <Tr key={index}>
                  <StyledTd>{index + 1}</StyledTd>
                  <TdWithHoverText
                    data-tooltip={file.original_image_name}
                    onClick={() => handleImageClick(file)}
                    cursor={
                      isImageProcessed(file.classification_status.status) ? 'pointer' : 'default'
                    }
                  >
                    <Thumbnail imageUrl={file.thumbnail || file.image} />
                  </TdWithHoverText>
                  <StyledTd>{statusLabels[file.classification_status.status]}</StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd></StyledTd>
                  <StyledTd>
                    <ButtonPrimary
                      type="button"
                      onClick={() => setImageId(file.id)}
                      disabled={!isImageProcessed(file.classification_status.status)}
                    >
                      Review
                    </ButtonPrimary>
                  </StyledTd>
                  <StyledTd>
                    <ButtonCaution type="button" onClick={() => handleRemoveFile(file)}>
                      <IconClose aria-label="close" />
                    </ButtonCaution>
                  </StyledTd>
                </Tr>
              ))}
            </tbody>
          </StickyObservationTable>
        </StyledOverflowWrapper>
      </InputWrapper>
      {imageId ? <ImageAnnotationModal imageId={imageId} setImageId={setImageId} /> : undefined}
    </>
  )
}

ImageClassificationObservationTable.propTypes = {
  uploadedFiles: PropTypes.arrayOf(PropTypes.object),
  handleRemoveFile: PropTypes.func,
}

export default ImageClassificationObservationTable

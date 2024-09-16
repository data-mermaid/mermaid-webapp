import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { EXCLUDE_PARAMS } from '../../../../library/constants/constants'

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
  const [images, setImages] = useState(uploadedFiles)
  const [polling, setPolling] = useState(false)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId, recordId } = useParams()
  const [imagesDoneProcessing, setImagesDoneProcessing] = useState(false)
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()

  const isImageProcessed = (status) => status === 3

  const handleImageClick = (file) => {
    if (isImageProcessed(file.classification_status.status)) {
      setImageId(file.id)
    }
  }

  const getBenthicAttributeLabel = (benthicAttributeId) => {
    const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
    return matchingBenthicAttribute?.name ?? ''
  }

  const getGrowthFormLabel = (growthFormId) => {
    const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
    return matchingGrowthForm?.name ?? ''
  }

  const _fetchImagesOnLoad = useEffect(() => {
    if (recordId && projectId) {
      databaseSwitchboardInstance
        .getAllImagesInCollectRecord(projectId, recordId, EXCLUDE_PARAMS)
        .then((response) => {
          setImages(response.results)
        })
        .catch((error) => {
          console.error('Error fetching images:', error)
        })

      databaseSwitchboardInstance
        .getChoices()
        .then(({ growthforms }) => {
          setGrowthForms(growthforms.data)
        })
        .catch((error) => {
          console.error('Error fetching growth forms:', error)
        })

      databaseSwitchboardInstance
        .getBenthicAttributes()
        .then((benthicAttributes) => {
          setBenthicAttributes(benthicAttributes)
        })
        .catch((error) => {
          console.error('Error fetching benthic attributes:', error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, recordId])

  // Poll every 5 seconds after the first image is uploaded
  const _pollImageStatuses = useEffect(() => {
    let intervalId
    const startPolling = async () => {
      try {
        const response = await databaseSwitchboardInstance.getAllImagesInCollectRecord(
          projectId,
          recordId,
          EXCLUDE_PARAMS,
        )
        setImages(response.results)

        const allProcessed = response.results.every((file) =>
          isImageProcessed(file.classification_status.status),
        )

        if (allProcessed) {
          clearInterval(intervalId)
          setPolling(false)
          setImagesDoneProcessing(true)
        } else {
          setImagesDoneProcessing(false)
        }
      } catch (error) {
        console.error('Error polling images:', error)
      }
    }

    if (polling) {
      intervalId = setInterval(startPolling, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling, projectId])

  const _beginPollingAfterFirstImageIsUploaded = useEffect(() => {
    if (uploadedFiles.length > 0 && !polling && !imagesDoneProcessing) {
      setPolling(true)
    }
  }, [uploadedFiles, polling, images, imagesDoneProcessing])

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
              {images.map((file, index) => {
                const classifiedPoints = file.points.filter(
                  ({ is_unclassified, annotations }) => !is_unclassified && annotations.length > 0,
                )

                const imageAnnotationData = Object.groupBy(
                  classifiedPoints,
                  ({ annotations }) =>
                    annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
                )

                return (
                  <React.Fragment key={index}>
                    <Tr>
                      <StyledTd>{index + 1}</StyledTd>
                      <TdWithHoverText
                        data-tooltip={file.original_image_name}
                        onClick={() => handleImageClick(file)}
                        cursor={
                          isImageProcessed(file.classification_status.status)
                            ? 'pointer'
                            : 'default'
                        }
                      >
                        <Thumbnail imageUrl={file.thumbnail || file.image} />
                      </TdWithHoverText>
                      <StyledTd>{statusLabels[file.classification_status.status]}</StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd>{file.num_confirmed}</StyledTd>
                      <StyledTd>{file.num_unconfirmed}</StyledTd>
                      <StyledTd>{file.num_unclassified}</StyledTd>
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

                    {/* Subrows based on imageAnnotationData */}
                    {Object.keys(imageAnnotationData).map((key, idx) => {
                      const confirmedCount = imageAnnotationData[key].reduce((count, item) => {
                        if (item.annotations[0].is_confirmed) {
                          return count + 1
                        }
                        return count
                      }, 0)

                      const unconfirmedCount = imageAnnotationData[key].reduce((count, item) => {
                        if (!item.annotations[0].is_confirmed) {
                          return count + 1
                        }
                        return count
                      }, 0)

                      return (
                        <Tr key={`${file.id}-sub-${idx}`}>
                          <StyledTd colSpan={3} />
                          <StyledTd>{imageAnnotationData[key][0].annotations[0].quadrat}</StyledTd>
                          <StyledTd>
                            {getBenthicAttributeLabel(
                              imageAnnotationData[key][0].annotations[0].benthic_attribute,
                            )}
                          </StyledTd>
                          <StyledTd>
                            {getGrowthFormLabel(
                              imageAnnotationData[key][0].annotations[0].growth_form,
                            )}
                          </StyledTd>
                          <StyledTd>{confirmedCount}</StyledTd>
                          <StyledTd>{unconfirmedCount}</StyledTd>
                          {/* Additional columns for subrow */}
                        </Tr>
                      )
                    })}
                  </React.Fragment>
                )
              })}
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

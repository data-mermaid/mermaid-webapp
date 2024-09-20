import React, { useState, useEffect, useCallback } from 'react'
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
  { align: 'right', id: 'quadrat-number-label', text: 'Quadrat' },
  { align: 'left', id: 'benthic-attribute-label', text: 'Benthic Attribute' },
  { align: 'right', id: 'growth-form-label', text: 'Growth Form' },
  { colSpan: 3, align: 'center', id: 'number-of-points-label', text: 'Number of Points' },
  { align: 'right', id: 'review', text: '' },
  { align: 'right', id: 'remove', text: '' },
]

const TableHeaderRow = () => (
  <Tr>
    {tableHeaders.map((header) => {
      const colSpan = header.id === 'number-of-points-label' ? 3 : header.colSpan || 1

      return (
        <Th key={header.id} align={header.align} id={header.id} colSpan={colSpan}>
          <span>{header.text}</span>
        </Th>
      )
    })}
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
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()
  const [distilledImages, setDistilledImages] = useState([])

  const isImageProcessed = (status) => status === 3 || status === 4

  const handleImageClick = (file) => {
    if (isImageProcessed(file.classification_status.status)) {
      setImageId(file.id)
    }
  }

  const getBenthicAttributeLabel = useCallback(
    (benthicAttributeId) => {
      const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
      return matchingBenthicAttribute?.name ?? ''
    },
    [benthicAttributes],
  )

  const getGrowthFormLabel = useCallback(
    (growthFormId) => {
      const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
      return matchingGrowthForm?.name ?? ''
    },
    [growthForms],
  )
  const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

  const distillAnnotationData = useCallback(
    (items, index) => {
      let confirmedCount = 0
      let benthic_attribute_label = null
      let growth_form_label = null

      items.forEach((item) => {
        const firstAnnotation = item.annotations[0]
        if (firstAnnotation.is_confirmed) {
          confirmedCount += 1
        }

        if (firstAnnotation.benthic_attribute) {
          benthic_attribute_label = getBenthicAttributeLabel(firstAnnotation.benthic_attribute)
        }

        if (firstAnnotation.growth_form) {
          growth_form_label = getGrowthFormLabel(firstAnnotation.growth_form)
        }
      })

      return {
        confirmedCount,
        benthic_attribute: benthic_attribute_label,
        growth_form: growth_form_label,
        quadrat: index + 1,
      }
    },
    [getBenthicAttributeLabel, getGrowthFormLabel],
  )

  const distillImagesObject = useCallback(
    (images) => {
      return images.map((file, index) => {
        const classifiedPoints = file.points.filter(({ annotations }) => annotations.length > 0)

        const imageAnnotationData = Object.groupBy(
          classifiedPoints,
          ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
        )

        const numSubRows = Object.keys(imageAnnotationData).length

        const distilledAnnotationData = Object.keys(imageAnnotationData).map((key) =>
          distillAnnotationData(imageAnnotationData[key], index),
        )

        return {
          file,
          numSubRows,
          distilledAnnotationData,
        }
      })
    },
    [distillAnnotationData],
  )

  const _fetchImagesOnLoad = useEffect(() => {
    if (recordId && projectId) {
      databaseSwitchboardInstance
        .getAllImagesInCollectRecord(projectId, recordId, EXCLUDE_PARAMS)
        .then((response) => {
          const sortedImages = response.results.map((image) => {
            const sortedPoints = image.points.map((point) => {
              const sortedAnnotations = point.annotations.sort(prioritizeConfirmedAnnotations)

              return { ...point, annotations: sortedAnnotations }
            })
            return { ...image, points: sortedPoints }
          })

          setImages(sortedImages)
          setDistilledImages(distillImagesObject(sortedImages))
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

  const _startPollingOnUpload = useEffect(() => {
    const hasNewImages = uploadedFiles.some((file) => !images.some((img) => img.id === file.id))

    if (hasNewImages) {
      setImages((prevImages) => {
        const existingImagesMap = new Map(prevImages.map((img) => [img.id, img]))

        // Merge existing images with newly uploaded ones
        const mergedImages = [...prevImages]

        uploadedFiles.forEach((file) => {
          if (!existingImagesMap.has(file.id)) {
            mergedImages.push(file)
          }
        })

        setDistilledImages(distillImagesObject(mergedImages))

        return mergedImages
      })

      if (!polling) {
        setPolling(true)
      }
    }
  }, [uploadedFiles, images, polling, distillImagesObject])

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
        setDistilledImages(distillImagesObject(response.results))

        const allProcessed = response.results.every((file) =>
          isImageProcessed(file.classification_status.status),
        )

        if (allProcessed) {
          setPolling(false)
        } else {
          // Schedule the next polling only after the current one completes
          intervalId = setTimeout(startPolling, 5000)
        }
      } catch (error) {
        console.error('Error polling images:', error)
        intervalId = setTimeout(startPolling, 5000)
      }
    }

    if (polling) {
      startPolling()
    }

    return () => {
      if (intervalId) {
        clearTimeout(intervalId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling, projectId, recordId])

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
              {distilledImages.map((image, imageIndex) => {
                const { file, distilledAnnotationData, numSubRows } = image

                if (numSubRows === 0) {
                  // If no subrows exist (image not processed), display a single row with thumbnail, status, review, and delete
                  {
                    console.log(isImageProcessed(file.classification_status.status))
                  }
                  return (
                    <Tr key={file.id}>
                      <StyledTd>{imageIndex + 1}</StyledTd>
                      <TdWithHoverText
                        data-tooltip={file.original_image_name}
                        onClick={() => handleImageClick(file)}
                        cursor={
                          isImageProcessed(file.classification_status.status)
                            ? 'pointer'
                            : 'default'
                        }
                      >
                        <Thumbnail imageUrl={file.thumbnail} />
                      </TdWithHoverText>

                      <StyledTd
                        colSpan={6}
                        textAlign={
                          isImageProcessed(file.classification_status.status) ? 'left' : 'center'
                        }
                      >
                        {statusLabels[file.classification_status.status]}
                      </StyledTd>

                      <StyledTd>
                        <button>Review</button>
                      </StyledTd>
                      <StyledTd>
                        <button>Delete</button>
                      </StyledTd>
                    </Tr>
                  )
                }

                // If there are subrows (processed image), render the rows with distilledAnnotationData
                return distilledAnnotationData.map((annotation, subIndex) => (
                  <Tr key={`${file.id}-${subIndex}`}>
                    {subIndex === 0 && (
                      <>
                        <StyledTd rowSpan={numSubRows}>{imageIndex + 1}</StyledTd>
                        <StyledTd rowSpan={numSubRows}>
                          <Thumbnail imageUrl={file.thumbnail} />
                        </StyledTd>
                      </>
                    )}

                    <StyledTd>{annotation.quadrat}</StyledTd>
                    <StyledTd>{annotation.benthic_attribute}</StyledTd>
                    <StyledTd>{annotation.growth_form || 'N/A'}</StyledTd>
                    <StyledTd>{annotation.confirmedCount}</StyledTd>

                    {/* First row only: Unconfirmed, Unclassified, Review, Delete */}
                    {subIndex === 0 && (
                      <>
                        <StyledTd rowSpan={numSubRows}>{file.num_unconfirmed}</StyledTd>
                        <StyledTd rowSpan={numSubRows}>{file.num_unclassified}</StyledTd>
                        <StyledTd rowSpan={numSubRows}>
                          <button>Review</button>
                        </StyledTd>
                        <StyledTd rowSpan={numSubRows}>
                          <button>Delete</button>
                        </StyledTd>
                      </>
                    )}
                  </Tr>
                ))
              })}
            </tbody>

            {/* <tbody>
              {images.map((file, index) => {
                const classifiedPoints = file.points.filter(
                  ({ annotations }) => annotations.length > 0,
                )

                const imageAnnotationData = Object.groupBy(
                  classifiedPoints,
                  ({ annotations }) =>
                    annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
                )

                const numSubRows = Object.keys(imageAnnotationData).length

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
                        rowspan={numSubRows}
                      >
                        <Thumbnail imageUrl={file.thumbnail} />
                      </TdWithHoverText>
                      {!!polling && (
                        <StyledTd>{statusLabels[file.classification_status.status]}</StyledTd>
                      )}
                      <StyledTd></StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd></StyledTd>
                      <StyledTd>{file.num_unconfirmed}</StyledTd>
                      <StyledTd>{file.num_unclassified}</StyledTd>
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

                    {Object.keys(imageAnnotationData).map((key, idx) => {
                      const { confirmedCount } = imageAnnotationData[key].reduce(
                        (counts, item) => {
                          if (item.annotations[0].is_confirmed) {
                            counts.confirmedCount += 1
                          }
                          return counts
                        },
                        { confirmedCount: 0 },
                      )

                      return (
                        <Tr key={`${file.id}-sub-${idx}`}>
                          <StyledTd colSpan={!polling ? 2 : 3} />
                          <StyledTd>{index + 1}</StyledTd>
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
                        </Tr>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </tbody> */}
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

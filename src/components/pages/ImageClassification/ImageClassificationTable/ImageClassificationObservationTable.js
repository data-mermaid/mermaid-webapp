import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import {
  StyledOverflowWrapper,
  StickyObservationTable,
} from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Th } from '../../../generic/Table/table'
import PropTypes from 'prop-types'
import {
  StyledTd,
  TdWithHoverText,
  ImageWrapper,
  StyledTr,
} from './ImageClassificationObservationTable.styles'
import { ButtonPrimary, ButtonCaution } from '../../../generic/buttons'
import { IconClose } from '../../../icons'
import ImageAnnotationModal from '../ImageAnnotationModal/ImageAnnotationModal'
import Thumbnail from './Thumbnail'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import getObservationValidationInfo from '../../collectRecordFormPages/CollectRecordFormPage/getObservationValidationInfo'
import { benthicPhotoQuadratPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import ObservationValidationInfo from '../../collectRecordFormPages/ObservationValidationInfo'

const EXCLUDE_PARAMS =
  'data,created_by,updated_by,updated_on,original_image_width,original_image_height,location,comments,image,photo_timestamp'

const tableHeaders = [
  { align: 'right', id: 'number-label', text: '#' },
  { align: 'center', id: 'thumbnail-label', text: 'Thumbnail' },
  { align: 'right', id: 'quadrat-number-label', text: 'Quadrat' },
  { align: 'left', id: 'benthic-attribute-label', text: 'Benthic Attribute' },
  { align: 'left', id: 'growth-form-label', text: 'Growth Form' },
  { colSpan: 3, align: 'center', id: 'number-of-points-label', text: 'Number of Points' },
  { align: 'right', id: 'review', text: '' },
  { align: 'right', id: 'remove', text: '' },
  { align: 'right', id: 'validations', text: 'Validations' },
]

const sortByLatest = (a, b) => new Date(a.file.created_on) - new Date(b.file.created_on)
const sortAlphabetically = (a, b) => a.benthicAttributeLabel.localeCompare(b.benthicAttributeLabel)
const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

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
  { align: 'right', text: 'Confirmed' },
  { align: 'right', text: 'Unconfirmed' },
  { align: 'right', text: 'Unknown' },
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
  1: 'Queued',
  2: 'Processing',
  3: 'Completed',
  4: 'Failed',
}

const ImageClassificationObservationTable = ({
  uploadedFiles,
  setUploadedFiles,
  collectRecord = undefined,
  areValidationsShowing,
  ignoreObservationValidations,
  resetObservationValidations,
}) => {
  const [imageId, setImageId] = useState()
  const [images, setImages] = useState([])
  const [polling, setPolling] = useState(false)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId, recordId } = useParams()
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()
  const [distilledImages, setDistilledImages] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const isFirstLoad = useRef(true)
  const [deletingImage, setDeletingImage] = useState()

  const isImageProcessed = (status) => status === 3 || status === 4

  const handleImageClick = (file) => {
    if (isImageProcessed(file.classification_status.status)) {
      setImageId(file.id)
    }
  }

  const handleRemoveImage = (file) => {
    setDeletingImage(file.id)

    databaseSwitchboardInstance
      .deleteImage(projectId, file.id)
      .then(() => {
        const updatedImages = images.filter((f) => f.id !== file.id)
        setImages(updatedImages)

        const updatedUploadedFiles = uploadedFiles.filter((f) => f.id !== file.id)
        setUploadedFiles(updatedUploadedFiles)

        toast.warn('File removed')
      })
      .catch(() => {
        toast.error('Failed to delete image')
      })
      .finally(() => {
        setDeletingImage()
      })
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

  const fetchImages = async () => {
    try {
      const [choicesResponse, benthicAttributesResponse] = await Promise.all([
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getBenthicAttributes(),
      ])

      setGrowthForms(choicesResponse.growthforms.data)
      setBenthicAttributes(benthicAttributesResponse)

      const response = await databaseSwitchboardInstance.getAllImagesInCollectRecord(
        projectId,
        recordId,
        EXCLUDE_PARAMS,
      )

      const sortedImages = response.results.map((image) => {
        const sortedPoints = image.points.map((point) => {
          const sortedAnnotations = point.annotations.sort(prioritizeConfirmedAnnotations)
          return { ...point, annotations: sortedAnnotations }
        })
        return { ...image, points: sortedPoints }
      })

      setImages(sortedImages)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const distillAnnotationData = useCallback(
    (items) => {
      if (!benthicAttributes || !growthForms) {
        return null
      }

      let confirmedCount = 0
      let hasUnconfirmedPoint = false
      let benthic_attribute_label = null
      let growth_form_label = null

      items.forEach((item) => {
        const firstAnnotation = item.annotations[0]
        if (firstAnnotation.is_confirmed) {
          confirmedCount += 1
        } else {
          hasUnconfirmedPoint = true
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
        hasUnconfirmedPoint,
        benthicAttributeLabel: benthic_attribute_label,
        growthFormLabel: growth_form_label,
      }
    },
    [getBenthicAttributeLabel, getGrowthFormLabel, benthicAttributes, growthForms],
  )

  const distillImagesData = useCallback(() => {
    return images
      .map((file, index) => {
        const classifiedPoints = file.points.filter(({ annotations }) => annotations.length > 0)

        const imageAnnotationData = Object.groupBy(
          classifiedPoints,
          ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
        )

        const numSubRows = Object.keys(imageAnnotationData).length

        const distilledAnnotationData = Object.keys(imageAnnotationData)
          .map((key) => distillAnnotationData(imageAnnotationData[key], index))
          .sort(sortAlphabetically)

        return {
          file,
          numSubRows,
          distilledAnnotationData,
        }
      })
      .sort(sortByLatest)
  }, [distillAnnotationData, images])

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
          setPolling(false)
        } else {
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

  const _fetchImagesOnLoad = useEffect(() => {
    if (!recordId || !projectId || isFetching || !isFirstLoad.current) {
      return
    }
    setIsFetching(true)
    isFirstLoad.current = false

    fetchImages()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const _distillImagesData = useEffect(() => {
    if (benthicAttributes && growthForms) {
      const distilled = distillImagesData(images)
      setDistilledImages(distilled)
    }
  }, [benthicAttributes, growthForms, images, distillImagesData])

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

        return mergedImages
      })

      if (!polling) {
        setPolling(true)
      }
    }
  }, [uploadedFiles, polling, images])

  let rowIndex = 1

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
                const id = file.id

                const {
                  isObservationValid,
                  hasObservationWarningValidation,
                  hasObservationErrorValidation,
                  hasObservationIgnoredValidation,
                  observationValidationMessages,
                  observationValidationType,
                } = getObservationValidationInfo({
                  id,
                  collectRecord,
                  areValidationsShowing,
                  observationsPropertyName: 'images',
                })

                if (numSubRows === 0) {
                  // If no subrows exist (image not processed), display a single row with thumbnail, status
                  return (
                    <Tr key={file.id}>
                      <StyledTd>{rowIndex++}</StyledTd>
                      <TdWithHoverText
                        data-tooltip={file.original_image_name}
                        onClick={() => handleImageClick(file)}
                        cursor={file.classification_status.status === 3 ? 'pointer' : 'default'}
                      >
                        <ImageWrapper>
                          <Thumbnail imageUrl={file.thumbnail} />
                        </ImageWrapper>
                      </TdWithHoverText>
                      <StyledTd
                        colSpan={8}
                        textAlign={file.classification_status.status === 3 ? 'left' : 'center'}
                      >
                        {statusLabels[file.classification_status.status]}
                      </StyledTd>
                    </Tr>
                  )
                }

                // If there are subrows (processed image), render annotation data
                return distilledAnnotationData.map((annotation, subIndex) => (
                  <StyledTr
                    key={`${file.id}-${subIndex}`}
                    $hasUnconfirmedPoint={annotation.hasUnconfirmedPoint}
                  >
                    <StyledTd>{rowIndex++}</StyledTd>
                    {subIndex === 0 && (
                      <>
                        <TdWithHoverText
                          rowSpan={numSubRows}
                          data-tooltip={file.original_image_name}
                          onClick={() => handleImageClick(file)}
                          cursor={file.classification_status.status === 3 ? 'pointer' : 'default'}
                        >
                          <ImageWrapper>
                            <Thumbnail imageUrl={file.thumbnail} />
                          </ImageWrapper>
                        </TdWithHoverText>
                      </>
                    )}
                    <StyledTd textAlign="right">{imageIndex + 1}</StyledTd>
                    <StyledTd>{annotation?.benthicAttributeLabel}</StyledTd>
                    <StyledTd>{annotation?.growthFormLabel || ''}</StyledTd>
                    <StyledTd textAlign="right">{annotation?.confirmedCount}</StyledTd>
                    {subIndex === 0 && (
                      <>
                        <StyledTd textAlign="right" rowSpan={numSubRows}>
                          {file.num_unconfirmed}
                        </StyledTd>
                        <StyledTd textAlign="right" rowSpan={numSubRows}>
                          {file.num_unclassified}
                        </StyledTd>
                        <StyledTd rowSpan={numSubRows}>
                          <ButtonPrimary
                            type="button"
                            onClick={() => setImageId(file.id)}
                            disabled={!isImageProcessed(file.classification_status.status)}
                          >
                            Review
                          </ButtonPrimary>
                        </StyledTd>
                        <StyledTd rowSpan={numSubRows}>
                          <ButtonCaution
                            type="button"
                            onClick={() => handleRemoveImage(file)}
                            disabled={
                              file.classification_status.status !== 3 || deletingImage === file.id
                            }
                          >
                            <IconClose aria-label="close" />
                          </ButtonCaution>
                        </StyledTd>
                        {areValidationsShowing ? (
                          <ObservationValidationInfo
                            hasObservationErrorValidation={hasObservationErrorValidation}
                            hasObservationIgnoredValidation={hasObservationIgnoredValidation}
                            hasObservationWarningValidation={hasObservationWarningValidation}
                            ignoreObservationValidations={ignoreObservationValidations}
                            isObservationValid={isObservationValid}
                            observationId={id}
                            observationValidationMessages={observationValidationMessages}
                            observationValidationType={observationValidationType}
                            resetObservationValidations={resetObservationValidations}
                          />
                        ) : null}
                      </>
                    )}
                  </StyledTr>
                ))
              })}
            </tbody>
          </StickyObservationTable>
        </StyledOverflowWrapper>
      </InputWrapper>
      {!!imageId && !!benthicAttributes && !!growthForms ? (
        <ImageAnnotationModal
          imageId={imageId}
          setImageId={setImageId}
          benthicAttributes={benthicAttributes}
          growthForms={growthForms}
          onAnnotationSaveSuccess={fetchImages}
        />
      ) : undefined}
    </>
  )
}

ImageClassificationObservationTable.propTypes = {
  uploadedFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUploadedFiles: PropTypes.func.isRequired,
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
}

export default ImageClassificationObservationTable

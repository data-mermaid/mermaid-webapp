import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { benthicPhotoQuadratPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import language from '../../../../language'
import { getToastArguments } from '../../../../library/getToastArguments'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../../../generic/buttons'
import { InputWrapper } from '../../../generic/form'
import { MuiTooltip } from '../../../generic/MuiTooltip'
import { RowRight } from '../../../generic/positioning'
import { ObservationsSummaryStats, Td, Th, Tr } from '../../../generic/Table/table'
import { H2 } from '../../../generic/text'
import { IconClose } from '../../../icons'
import {
  StickyObservationTable,
  StyledOverflowWrapper,
} from '../../collectRecordFormPages/CollectingFormPage.Styles'
import getObservationValidationInfo from '../../collectRecordFormPages/CollectRecordFormPage/getObservationValidationInfo'
import ObservationValidationInfo from '../../collectRecordFormPages/ObservationValidationInfo'
import { getIsImageProcessed } from '../getIsImageProcessed'
import ImageAnnotationModal from '../ImageAnnotationModal/ImageAnnotationModal'
import LoadingModal from '../../../LoadingModal'
import {
  EXCLUDE_PARAMS_FOR_GET_ALL_IMAGES_IN_COLLECT_RECORD,
  IMAGE_CLASSIFICATION_STATUS,
  IMAGE_CLASSIFICATION_STATUS_LABEL,
} from '../imageClassificationConstants'
import {
  ImageWrapper,
  LoadingTableBody,
  Spinner,
  StyledTd,
  StyledTr,
  TdWithHoverText,
} from './ImageClassificationObservationTable.styles'
import Thumbnail from './Thumbnail'

const tableHeaders = [
  { align: 'right', id: 'number-label', text: '#' },
  { align: 'center', id: 'photo-label', text: 'Photo' },
  { align: 'right', id: 'quadrat-number-label', text: 'Quadrat' },
  { align: 'left', id: 'benthic-attribute-label', text: 'Benthic Attribute' },
  { align: 'left', id: 'growth-form-label', text: 'Growth Form' },
  { align: 'right', id: 'confirmed-points', text: 'Confirmed Points' },
  { align: 'right', id: 'unconfirmed-points', text: 'Unconfirmed Points' },
  { align: 'left', id: 'validations', text: 'Validations' },
  { align: 'center', id: 'review', text: '' },
  { align: 'center', id: 'remove', text: '' },
]

const sortByLatest = (a, b) => new Date(a.file.created_on) - new Date(b.file.created_on)
const sortAlphabetically = (a, b) => a.benthicAttributeLabel.localeCompare(b.benthicAttributeLabel)
const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

const TableHeaderRow = ({ areValidationsShowing }) => {
  const filteredHeaders = tableHeaders.filter(
    (header) => header.id !== 'validations' || areValidationsShowing,
  )

  return (
    <Tr>
      {filteredHeaders.map((header) => (
        <Th key={header.id} align={header.align} id={header.id} colSpan={header.colSpan || 1}>
          <span>{header.text}</span>
        </Th>
      ))}
    </Tr>
  )
}
TableHeaderRow.propTypes = {
  areValidationsShowing: PropTypes.bool.isRequired,
}

const ImageClassificationObservationTable = ({
  collectRecord = undefined,
  areValidationsShowing,
  ignoreObservationValidations,
  resetObservationValidations,
  images,
  setImages,
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId, recordId } = useParams()
  const isFirstLoad = useRef(true)

  const [imageId, setImageId] = useState()
  const [growthForms, setGrowthForms] = useState()
  const [benthicAttributes, setBenthicAttributes] = useState()
  const [distilledImages, setDistilledImages] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null)
  const [removingPhotoFile, setRemovingPhotoFile] = useState()
  const [isRemovePhotoModalOpen, setIsRemovePhotoModalOpen] = useState(false)
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false)

  const numPointsPerQuadrat = collectRecord?.data?.quadrat_transect?.num_points_per_quadrat ?? 0

  const observationsSummaryStats = useMemo(() => {
    if (!distilledImages.length || !benthicAttributes) {
      return {}
    }

    const allPoints = distilledImages.flatMap((image) => image.distilledAnnotationData)
    const categoryGroups = allPoints.reduce(
      (accumulator, point) => {
        const topLevelId = benthicAttributes.find(
          ({ id }) => id === point.benthicAttributeId,
        )?.top_level_category

        const topLevelName = benthicAttributes.find(({ id }) => id === topLevelId)?.name

        if (accumulator[topLevelName]) {
          accumulator[topLevelName] += point.confirmedCount + point.unconfirmedCount
        } else {
          accumulator[topLevelName] = point.confirmedCount + point.unconfirmedCount
        }

        accumulator.total += point.confirmedCount + point.unconfirmedCount

        return accumulator
      },
      { total: 0 },
    )

    return categoryGroups
  }, [distilledImages, benthicAttributes])

  const handleImageClick = (file) => {
    if (getIsImageProcessed(file.classification_status?.status)) {
      setImageId(file.id)
    }
  }

  const openRemovePhotoModal = (file) => {
    setRemovingPhotoFile(file)
    setIsRemovePhotoModalOpen(true)
  }
  const closeRemovePhotoModal = () => {
    setIsRemovePhotoModalOpen(false)
  }

  const handleRemovePhoto = () => {
    setIsRemovingPhoto(true)

    databaseSwitchboardInstance
      .deleteImage(projectId, removingPhotoFile.id)
      .then(() => {
        const updatedImages = images.filter((f) => f.id !== removingPhotoFile.id)
        setImages(updatedImages)

        toast.warn(language.imageClassification.imageClassificationModal.userMessage.photoRemoved)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(
              ...getToastArguments(
                `${language.imageClassification.imageClassificationModal.errors.failedDeletion} ${removingPhotoFile.original_image_name}. ${error.message}`,
              ),
            )
          },
          shouldShowServerNonResponseMessage: false,
        })
      })
      .finally(() => {
        setRemovingPhotoFile()
        setIsRemovingPhoto(false)
        closeRemovePhotoModal()
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

  const fetchImages = useCallback(async () => {
    try {
      const [choicesResponse, benthicAttributesResponse] = await Promise.all([
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getBenthicAttributes(),
      ])

      setGrowthForms(choicesResponse.growthforms.data)
      setBenthicAttributes(benthicAttributesResponse)

      const imagesResponse = await databaseSwitchboardInstance.getAllImagesInCollectRecord(
        projectId,
        recordId,
        EXCLUDE_PARAMS_FOR_GET_ALL_IMAGES_IN_COLLECT_RECORD,
      )

      const sortedImages = imagesResponse.results.map((image) => {
        const sortedPoints = image.points.map((point) => {
          const sortedAnnotations = point.annotations.sort(prioritizeConfirmedAnnotations)
          return { ...point, annotations: sortedAnnotations }
        })
        return { ...image, points: sortedPoints }
      })

      setImages(sortedImages)
    } catch (error) {
      handleHttpResponseError({
        error,
        callback: () => {
          console.error('Error fetching photos:', error)
        },
        shouldShowServerNonResponseMessage: false,
      })
    } finally {
      setIsFetching(false)
    }
  }, [databaseSwitchboardInstance, handleHttpResponseError, projectId, recordId, setImages])

  const distillAnnotationData = useCallback(
    (items) => {
      if (!benthicAttributes || !growthForms) {
        return null
      }

      let confirmedCount = 0
      let unconfirmedCount = 0
      let benthic_attribute_label = null
      let growth_form_label = null
      let benthic_attribute_id = null
      let growth_form_id = null

      items.forEach((item) => {
        const firstAnnotation = item.annotations[0]

        if (firstAnnotation.is_confirmed) {
          confirmedCount += 1
        } else {
          unconfirmedCount += 1
        }

        if (firstAnnotation.benthic_attribute) {
          benthic_attribute_label = getBenthicAttributeLabel(firstAnnotation.benthic_attribute)
          benthic_attribute_id = firstAnnotation.benthic_attribute
        }

        if (firstAnnotation.growth_form) {
          growth_form_label = getGrowthFormLabel(firstAnnotation.growth_form)
          growth_form_id = firstAnnotation.growth_form
        }
      })

      return {
        confirmedCount,
        unconfirmedCount,
        benthicAttributeLabel: benthic_attribute_label,
        benthicAttributeId: benthic_attribute_id,
        growthFormLabel: growth_form_label,
        growthFormId: growth_form_id,
      }
    },
    [getBenthicAttributeLabel, getGrowthFormLabel, benthicAttributes, growthForms],
  )

  const distillImagesData = useCallback(() => {
    return images
      .map((file, index) => {
        const classifiedPoints = file.points.filter(({ annotations }) => annotations.length > 0)
        let totalConfirmed = 0
        let totalUnconfirmed = 0
        let totalUnknown = 0

        const imageAnnotationData = Object.groupBy(
          classifiedPoints,
          ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
        )

        const numSubRows = Object.keys(imageAnnotationData).length

        const distilledAnnotationData = Object.keys(imageAnnotationData)
          .map((key) => distillAnnotationData(imageAnnotationData[key], index))
          .sort(sortAlphabetically)

        distilledAnnotationData.forEach((item) => {
          totalConfirmed += item.confirmedCount
          totalUnconfirmed += item.unconfirmedCount
        })

        totalUnknown = numPointsPerQuadrat - totalConfirmed - totalUnconfirmed

        return {
          file,
          numSubRows,
          distilledAnnotationData,
          totalConfirmed,
          totalUnconfirmed,
          totalUnknown,
        }
      })
      .sort(sortByLatest)
  }, [distillAnnotationData, images, numPointsPerQuadrat])

  const _fetchImagesOnLoad = useEffect(() => {
    if (!recordId || !projectId || !isFirstLoad.current) {
      return
    }
    setIsFetching(true)
    isFirstLoad.current = false

    fetchImages()
  }, [fetchImages, projectId, recordId])

  const _distillImagesData = useEffect(() => {
    if (benthicAttributes && growthForms) {
      const distilled = distillImagesData(images)
      setDistilledImages(distilled)
    }
  }, [benthicAttributes, growthForms, images, distillImagesData])

  let rowIndex = 1

  const buildObservationId = (imageId, benthicAttributeId = null, growthFormId = null) => {
    let observationId = imageId

    if (benthicAttributeId) {
      observationId += `::${benthicAttributeId}::`
    }

    if (growthFormId) {
      observationId += `${growthFormId}`
    }

    return observationId
  }

  const handleRowMouseEnter = (imageIndex) => {
    setHoveredImageIndex(imageIndex)
  }

  const handleRowMouseLeave = () => {
    setHoveredImageIndex(null)
  }

  const removePhotoModal = (
    <>
      <Modal
        title={language.imageClassification.removePhotoModal.title}
        isOpen={isRemovePhotoModalOpen}
        onDismiss={closeRemovePhotoModal}
        mainContent={language.imageClassification.removePhotoModal.prompt}
        footerContent={
          <RightFooter>
            <ButtonSecondary onClick={closeRemovePhotoModal}>
              {language.buttons.cancel}
            </ButtonSecondary>
            <ButtonCaution disabled={isRemovingPhoto} onClick={handleRemovePhoto}>
              {language.imageClassification.removePhotoModal.yes}
            </ButtonCaution>
          </RightFooter>
        }
      />
      {isRemovingPhoto && <LoadingModal />}
    </>
  )

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">Observations</H2>
        <StyledOverflowWrapper>
          <StickyObservationTable aria-labelledby="table-label">
            <thead>
              <TableHeaderRow areValidationsShowing={areValidationsShowing} />
            </thead>

            {isFetching ? (
              <LoadingTableBody>
                <tr>
                  <td colSpan={8}>
                    <Spinner /> Loading...
                  </td>
                </tr>
              </LoadingTableBody>
            ) : (
              <tbody>
                {distilledImages.map((image, imageIndex) => {
                  const { file, distilledAnnotationData, numSubRows, totalUnknown } = image
                  const imgId = file.id

                  if (numSubRows === 0) {
                    // If no subrows exist (image not processed), display a single row with thumbnail, status
                    return (
                      <Tr key={file.id}>
                        <StyledTd textAlign="right">{rowIndex++}</StyledTd>
                        <TdWithHoverText
                          data-tooltip={file.original_image_name}
                          onClick={() => handleImageClick(file)}
                          cursor={
                            file.classification_status?.status ===
                            IMAGE_CLASSIFICATION_STATUS.completed
                              ? 'pointer'
                              : 'default'
                          }
                        >
                          <ImageWrapper>
                            {file.thumbnail ? (
                              <Thumbnail imageUrl={file.thumbnail} />
                            ) : (
                              <div>
                                <Spinner />
                                Loading {file.original_image_name}
                              </div>
                            )}
                          </ImageWrapper>
                        </TdWithHoverText>
                        <StyledTd
                          colSpan={8}
                          textAlign={
                            file.classification_status?.status ===
                            IMAGE_CLASSIFICATION_STATUS.completed
                              ? 'left'
                              : 'center'
                          }
                        >
                          {!getIsImageProcessed(file.classification_status?.status) ? (
                            <>
                              <Spinner />
                              {
                                IMAGE_CLASSIFICATION_STATUS_LABEL[
                                  file.classification_status?.status
                                ]
                              }
                              ...
                            </>
                          ) : (
                            IMAGE_CLASSIFICATION_STATUS_LABEL[file.classification_status?.status]
                          )}
                        </StyledTd>
                      </Tr>
                    )
                  }

                  // If there are subrows (processed image), render annotation data
                  return (
                    <React.Fragment key={imgId}>
                      {distilledAnnotationData.map((annotation, subIndex) => {
                        const benthicAttributeId = annotation.benthicAttributeId
                        const growthFormId = annotation.growthFormId
                        const obsId = buildObservationId(imgId, benthicAttributeId, growthFormId)
                        const isGroupHovered = hoveredImageIndex === imageIndex

                        const {
                          isObservationValid,
                          hasObservationWarningValidation,
                          hasObservationErrorValidation,
                          hasObservationIgnoredValidation,
                          observationValidationMessages,
                          observationValidationType,
                        } = getObservationValidationInfo({
                          observationId: obsId,
                          collectRecord,
                          areValidationsShowing,
                          observationsPropertyName: 'obs_benthic_photo_quadrats',
                        })

                        return (
                          <StyledTr
                            key={`${file.id}-${subIndex}`}
                            $hasUnconfirmedPoint={annotation.unconfirmedCount > 0}
                            $messageType={
                              hasObservationErrorValidation
                                ? 'error'
                                : hasObservationWarningValidation
                                ? 'warning'
                                : null
                            }
                            onMouseEnter={() => handleRowMouseEnter(imageIndex)}
                            onMouseLeave={handleRowMouseLeave}
                          >
                            <StyledTd textAlign="right">{rowIndex++}</StyledTd>
                            {subIndex === 0 && (
                              <>
                                <TdWithHoverText
                                  rowSpan={numSubRows + (totalUnknown > 0 ? 1 : 0)}
                                  data-tooltip={file.original_image_name}
                                  onClick={() => handleImageClick(file)}
                                  cursor={
                                    file.classification_status?.status ===
                                    IMAGE_CLASSIFICATION_STATUS.completed
                                      ? 'pointer'
                                      : 'default'
                                  }
                                  className={isGroupHovered ? 'hover-highlight' : ''}
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
                            <StyledTd textAlign="right">{annotation?.confirmedCount} </StyledTd>
                            <StyledTd textAlign="right">{annotation?.unconfirmedCount}</StyledTd>
                            {subIndex === 0 && (
                              <>
                                {areValidationsShowing ? (
                                  <StyledTd>
                                    {hasObservationErrorValidation &&
                                    annotation?.unconfirmedCount ? (
                                      <ObservationValidationInfo
                                        hasObservationErrorValidation={
                                          hasObservationErrorValidation
                                        }
                                        hasObservationIgnoredValidation={
                                          hasObservationIgnoredValidation
                                        }
                                        hasObservationWarningValidation={
                                          hasObservationWarningValidation
                                        }
                                        ignoreObservationValidations={ignoreObservationValidations}
                                        isObservationValid={isObservationValid}
                                        observationId={obsId}
                                        observationValidationMessages={
                                          observationValidationMessages
                                        }
                                        observationValidationType={observationValidationType}
                                        resetObservationValidations={resetObservationValidations}
                                      />
                                    ) : null}
                                  </StyledTd>
                                ) : null}
                                <StyledTd
                                  textAlign="center"
                                  rowSpan={numSubRows + (totalUnknown > 0 ? 1 : 0)}
                                  className={isGroupHovered ? 'hover-highlight' : ''}
                                >
                                  <MuiTooltip
                                    title={
                                      language.imageClassification.imageClassificationModal.tooltip
                                        .reviewPhoto
                                    }
                                  >
                                    <ButtonPrimary
                                      type="button"
                                      onClick={() => setImageId(file.id)}
                                      disabled={
                                        !getIsImageProcessed(file.classification_status?.status)
                                      }
                                    >
                                      {language.imageClassification.imageClassificationModal.review}
                                    </ButtonPrimary>
                                  </MuiTooltip>
                                </StyledTd>
                                <StyledTd
                                  textAlign="center"
                                  rowSpan={numSubRows + (totalUnknown > 0 ? 1 : 0)}
                                  className={isGroupHovered ? 'hover-highlight' : ''}
                                >
                                  <MuiTooltip
                                    title={
                                      language.imageClassification.imageClassificationModal.tooltip
                                        .removePhoto
                                    }
                                  >
                                    <ButtonCaution
                                      type="button"
                                      onClick={() => openRemovePhotoModal(file)}
                                      disabled={
                                        file.classification_status?.status !==
                                        IMAGE_CLASSIFICATION_STATUS.completed
                                      }
                                    >
                                      <IconClose aria-label="close" />
                                    </ButtonCaution>
                                  </MuiTooltip>
                                </StyledTd>
                              </>
                            )}
                            {areValidationsShowing && subIndex >= 1 ? (
                              <StyledTd>
                                {hasObservationErrorValidation && annotation?.unconfirmedCount ? (
                                  <ObservationValidationInfo
                                    hasObservationErrorValidation={hasObservationErrorValidation}
                                    hasObservationIgnoredValidation={
                                      hasObservationIgnoredValidation
                                    }
                                    hasObservationWarningValidation={
                                      hasObservationWarningValidation
                                    }
                                    ignoreObservationValidations={ignoreObservationValidations}
                                    isObservationValid={isObservationValid}
                                    observationId={obsId}
                                    observationValidationMessages={observationValidationMessages}
                                    observationValidationType={observationValidationType}
                                    resetObservationValidations={resetObservationValidations}
                                  />
                                ) : null}
                              </StyledTd>
                            ) : null}
                          </StyledTr>
                        )
                      })}
                      {totalUnknown > 0 && (
                        <StyledTr
                          key={`${file.id}-unknown`}
                          onMouseEnter={() => handleRowMouseEnter(imageIndex)}
                          onMouseLeave={handleRowMouseLeave}
                          $isUnclassified={true}
                        >
                          <StyledTd textAlign="right">{rowIndex++}</StyledTd>
                          <StyledTd textAlign="right">{imageIndex + 1}</StyledTd>
                          <StyledTd colSpan={3} textAlign="center" style={{ fontWeight: '700' }}>
                            {`${totalUnknown} Unclassified point${totalUnknown > 1 ? 's' : ''}`}
                          </StyledTd>
                          <StyledTd />
                        </StyledTr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            )}
          </StickyObservationTable>
        </StyledOverflowWrapper>
      </InputWrapper>
      <RowRight>
        <ObservationsSummaryStats>
          <tbody>
            {Object.keys(observationsSummaryStats)
              .sort()
              .map((obs) => {
                const percentage = roundToOneDecimal(
                  (observationsSummaryStats[obs] / observationsSummaryStats.total) * 100,
                )

                return obs !== 'total' ? (
                  <Tr key={obs}>
                    <Th>% {obs}</Th>
                    <Td>{percentage}</Td>
                  </Tr>
                ) : null
              })}
          </tbody>
        </ObservationsSummaryStats>
      </RowRight>
      {!!imageId && !!benthicAttributes && !!growthForms && (
        <ImageAnnotationModal
          imageId={imageId}
          setImageId={setImageId}
          benthicAttributes={benthicAttributes}
          growthForms={growthForms}
          onAnnotationSaveSuccess={fetchImages}
        />
      )}
      {removePhotoModal}
    </>
  )
}

ImageClassificationObservationTable.propTypes = {
  setUploadedFiles: PropTypes.func,
  areValidationsShowing: PropTypes.bool.isRequired,
  collectRecord: benthicPhotoQuadratPropType,
  ignoreObservationValidations: PropTypes.func.isRequired,
  resetObservationValidations: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
}

export default ImageClassificationObservationTable

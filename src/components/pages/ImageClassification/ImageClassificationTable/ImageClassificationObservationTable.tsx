import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import Modal, { RightFooter } from '../../../generic/Modal'
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
import { ImageClassificationImage } from '../../../../types/ImageClassificationTypes'
import getObservationValidationInfo from '../../collectRecordFormPages/CollectRecordFormPage/getObservationValidationInfo'
import ObservationValidationInfo from '../../collectRecordFormPages/ObservationValidationInfo'
import { MessageType } from '../../../../types/constants'
import {
  BenthicPhotoQuadratRecord,
  ImageClassificationPointAnnotation,
} from '../../../../App/mermaidData/mermaidDataTypes'

interface TableHeaderProps {
  align: 'left' | 'right' | 'center'
  id: string
  text: string
}

const tableHeaders: TableHeaderProps[] = [
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

interface GrowthForm {
  id: string
  name: string
}

interface BenthicAttribute {
  id: string
  name: string
  top_level_category?: string
}

interface CategoryGroup {
  [categoryName: string]: number

  total?: number
}

interface DistilledAnnotationData {
  confirmedCount: number
  unconfirmedCount: number
  benthicAttributeLabel: string | null
  benthicAttributeId: string | null
  growthFormLabel: string | null
  growthFormId: string | null
}

interface DistilledImage {
  annotations: ImageClassificationPointAnnotation[]
  file: ImageClassificationImage
  numSubRows: number
  distilledAnnotationData: DistilledAnnotationData[]
  totalConfirmed: number
  totalUnconfirmed: number
  totalUnknown: number
}

interface ImageClassificationObservationTableProps {
  collectRecord?: BenthicPhotoQuadratRecord
  areValidationsShowing: boolean
  ignoreObservationValidations: () => void
  resetObservationValidations: () => void
  images: ImageClassificationImage[]
  setImages: React.Dispatch<React.SetStateAction<ImageClassificationImage[]>>
}

const sortByLatest = (a, b) =>
  new Date(a.file.created_on).getTime() - new Date(b.file.created_on).getTime()
const sortAlphabetically = (a, b) => a.benthicAttributeLabel.localeCompare(b.benthicAttributeLabel)
const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

const TableHeaderRow = ({ areValidationsShowing }: { areValidationsShowing: boolean }) => {
  const filteredHeaders = tableHeaders.filter(
    (header) => header.id !== 'validations' || areValidationsShowing,
  )

  return (
    <Tr>
      {filteredHeaders.map((header) => (
        <Th key={header.id} align={header.align} id={header.id}>
          <span>{header.text}</span>
        </Th>
      ))}
    </Tr>
  )
}

const ImageClassificationObservationTable = ({
  collectRecord = undefined,
  areValidationsShowing,
  ignoreObservationValidations,
  resetObservationValidations,
  images: imageSet,
  setImages,
}: ImageClassificationObservationTableProps) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId, recordId } = useParams()
  const isFirstLoad = useRef(true)
  const { t } = useTranslation()

  const [imageId, setImageId] = useState<string>()
  const [growthForms, setGrowthForms] = useState<GrowthForm[] | undefined>()
  const [benthicAttributes, setBenthicAttributes] = useState<BenthicAttribute[] | undefined>()
  const [distilledImages, setDistilledImages] = useState<DistilledImage[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [removingPhotoFile, setRemovingPhotoFile] = useState<ImageClassificationImage | undefined>()
  const [isRemovePhotoModalOpen, setIsRemovePhotoModalOpen] = useState<boolean>(false)
  const [isRemovingPhoto, setIsRemovingPhoto] = useState<boolean>(false)

  const numPointsPerQuadrat: number =
    collectRecord?.data?.quadrat_transect?.num_points_per_quadrat ?? 0

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

      const sortedImages = imagesResponse.results.map((image: ImageClassificationImage) => {
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
  const getGrowthFormLabel = useCallback(
    (growthFormId: string) => {
      const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
      return matchingGrowthForm?.name ?? ''
    },
    [growthForms],
  )
  const getBenthicAttributeLabel = useCallback(
    (benthicAttributeId: string) => {
      const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
      return matchingBenthicAttribute?.name ?? ''
    },
    [benthicAttributes],
  )
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

  const distillImagesData = useCallback((): DistilledImage[] => {
    return imageSet
      .map((file: ImageClassificationImage) => {
        const classifiedPoints = file.points.filter(({ annotations }) => annotations.length > 0)
        let totalConfirmed = 0
        let totalUnconfirmed = 0
        let totalUnknown = 0

        const imageAnnotationData = Object.groupBy(
          classifiedPoints,
          ({ annotations }) => annotations[0].benthic_attribute + '_' + annotations[0].growth_form,
        )

        const subRows = Object.keys(imageAnnotationData)
        const numSubRows = subRows.length

        const distilledAnnotationData = subRows
          .map((key) => distillAnnotationData(imageAnnotationData[key]))
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
      .sort(sortByLatest) as DistilledImage[]
  }, [distillAnnotationData, imageSet, numPointsPerQuadrat])

  useEffect(() => {
    if (!recordId || !projectId || !isFirstLoad.current) {
      return
    }
    setIsFetching(true)
    isFirstLoad.current = false

    fetchImages()
  }, [fetchImages, projectId, recordId])

  //Distill image data
  useEffect(() => {
    if (benthicAttributes && growthForms) {
      const distilled = distillImagesData()

      setDistilledImages(distilled)
    }
  }, [benthicAttributes, growthForms, imageSet, distillImagesData])

  const observationsSummaryStats = useMemo((): CategoryGroup => {
    if (!distilledImages?.length || !benthicAttributes) {
      return {}
    }

    const allPoints = distilledImages?.flatMap((image) => {
      return image.distilledAnnotationData
    })
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

  const handleImageClick = (file: ImageClassificationImage) => {
    if (getIsImageProcessed(file.classification_status?.status)) {
      setImageId(file.id)
    }
  }

  const openRemovePhotoModal = (file: ImageClassificationImage) => {
    setRemovingPhotoFile(file)
    setIsRemovePhotoModalOpen(true)
  }
  const closeRemovePhotoModal = () => {
    setIsRemovePhotoModalOpen(false)
  }

  const removePhotoFromDatabase = async (photo = undefined) => {
    setIsRemovingPhoto(true)

    let photoToBeRemoved
    try {
      photoToBeRemoved = isRemovePhotoModalOpen ? removingPhotoFile : photo

      if (!photoToBeRemoved?.id) {
        toast.error(t('image_classification.errors.no_photo_found'))
        return
      }

      await databaseSwitchboardInstance.deleteImage(projectId, photoToBeRemoved.id)

      setImages((prev) => prev.filter((img) => img.id !== photoToBeRemoved.id))
      toast.warn(t('image_classification.warns.photo_removed'))
    } catch (error: unknown) {
      handleHttpResponseError({
        error,
        callback: () => {
          toast.error(
            t('image_classification.errors.failed_deletion', {
              imageName: photoToBeRemoved?.original_image_name,
              errorMessage: (error as Error)?.message,
            }),
          )
        },
        shouldShowServerNonResponseMessage: false,
      })
    } finally {
      setIsRemovingPhoto(false)

      if (isRemovePhotoModalOpen) {
        setRemovingPhotoFile(undefined)
        closeRemovePhotoModal()
      }
    }
  }

  let rowIndex = 1

  const buildObservationId = (
    imageId: string,
    benthicAttributeId?: string,
    growthFormId?: string,
  ) => {
    let observationId = imageId

    if (benthicAttributeId) {
      observationId += `::${benthicAttributeId}::`
    }

    if (growthFormId) {
      observationId += `${growthFormId}`
    }

    return observationId
  }

  const handleRowMouseEnter = (imageIndex: number) => {
    setHoveredImageIndex(imageIndex)
  }

  const handleRowMouseLeave = () => {
    setHoveredImageIndex(null)
  }

  const RemovePhotoModal = (
    <>
      <Modal
        title={t('image_classification.remove_photo')}
        data-testid="remove-photo-modal"
        isOpen={isRemovePhotoModalOpen}
        onDismiss={closeRemovePhotoModal}
        mainContent={t('image_classification.remove_photo_confirmation')}
        footerContent={
          <RightFooter>
            <ButtonSecondary onClick={closeRemovePhotoModal}>{t('buttons.cancel')}</ButtonSecondary>
            <ButtonCaution disabled={isRemovingPhoto} onClick={removePhotoFromDatabase}>
              {t('image_classification.remove_photo')}
            </ButtonCaution>
          </RightFooter>
        }
      />
      {isRemovingPhoto && <LoadingModal />}
    </>
  )

  const ComponentBreakdown = () => {
    return (
      <>
        {distilledImages?.map((image, imageIndex) => {
          const { file, distilledAnnotationData, numSubRows, totalUnknown } = image
          const imgId = file.id
          if (
            numSubRows === 0 ||
            file.classification_status?.status === IMAGE_CLASSIFICATION_STATUS.failed
          ) {
            // If no subrows exist (image not processed), display a single row with thumbnail, status
            return (
              <Tr key={file.id}>
                <StyledTd style={{ textAlign: 'right' }}>{rowIndex++}</StyledTd>
                <TdWithHoverText
                  data-tooltip={file.original_image_name}
                  onClick={() => handleImageClick(file)}
                  cursor={
                    file.classification_status?.status === IMAGE_CLASSIFICATION_STATUS.completed
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
                        {t('loading_item', { itemName: file.original_image_name })}
                      </div>
                    )}
                  </ImageWrapper>
                </TdWithHoverText>
                <StyledTd
                  colSpan={6}
                  style={{
                    textAlign: `${
                      file.classification_status?.status === IMAGE_CLASSIFICATION_STATUS.completed
                        ? 'left'
                        : 'center'
                    }`,
                  }}
                >
                  {!getIsImageProcessed(file.classification_status?.status) ? (
                    <>
                      <Spinner />
                      {IMAGE_CLASSIFICATION_STATUS_LABEL[file.classification_status?.status]}
                      ...
                    </>
                  ) : (
                    IMAGE_CLASSIFICATION_STATUS_LABEL[file.classification_status?.status]
                  )}
                </StyledTd>
                <StyledTd style={{ textAlign: 'center' }}>
                  <MuiTooltip title={t('image_classification.remove_photo')}>
                    <ButtonCaution
                      type="button"
                      data-testid={`remove-photo-${file.id}`}
                      onClick={() => removePhotoFromDatabase(file)}
                      aria-label={t('buttons.close')}
                    >
                      <IconClose aria-label={t('buttons.close')} />
                    </ButtonCaution>
                  </MuiTooltip>
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
                let trMessageType: MessageType

                if (hasObservationErrorValidation) {
                  trMessageType = 'error'
                } else if (hasObservationWarningValidation) {
                  trMessageType = 'warning'
                }

                const shouldDisplayObservationValidation = Boolean(
                  hasObservationErrorValidation && annotation?.unconfirmedCount,
                )
                
                return (
                  <StyledTr
                    key={`${file.id}-${subIndex}`}
                    $hasUnconfirmedPoint={annotation.unconfirmedCount > 0}
                    $messageType={trMessageType}
                    onMouseEnter={() => handleRowMouseEnter(imageIndex)}
                    onMouseLeave={handleRowMouseLeave}
                  >
                    <StyledTd style={{ textAlign: 'right' }}>{rowIndex++}</StyledTd>
                    {subIndex === 0 && (
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
                    )}
                    <StyledTd style={{ textAlign: 'right' }}>{imageIndex + 1}</StyledTd>
                    <StyledTd>{annotation?.benthicAttributeLabel}</StyledTd>
                    <StyledTd>{annotation?.growthFormLabel || ''}</StyledTd>
                    <StyledTd style={{ textAlign: 'right' }}>
                      {annotation?.confirmedCount}{' '}
                    </StyledTd>
                    <StyledTd style={{ textAlign: 'right' }}>
                      {annotation?.unconfirmedCount}
                    </StyledTd>
                    {subIndex === 0 && (
                      <>
                        {areValidationsShowing && (
                          <StyledTd>
                            {shouldDisplayObservationValidation && (
                              <ObservationValidationInfo
                                hasObservationErrorValidation={hasObservationErrorValidation}
                                hasObservationIgnoredValidation={hasObservationIgnoredValidation}
                                hasObservationWarningValidation={hasObservationWarningValidation}
                                ignoreObservationValidations={ignoreObservationValidations}
                                isObservationValid={isObservationValid}
                                observationId={obsId}
                                observationValidationMessages={observationValidationMessages}
                                observationValidationType={observationValidationType}
                                resetObservationValidations={resetObservationValidations}
                              />
                            )}
                          </StyledTd>
                        )}
                        <StyledTd
                          style={{ textAlign: 'center' }}
                          rowSpan={numSubRows + (totalUnknown > 0 ? 1 : 0)}
                          className={isGroupHovered ? 'hover-highlight' : ''}
                        >
                          <MuiTooltip title={t('image_classification.review_this_photo')}>
                            <ButtonPrimary
                              type="button"
                              data-testid={`review-photo-${file.id}`}
                              onClick={() => setImageId(file.id)}
                              disabled={!getIsImageProcessed(file.classification_status?.status)}
                            >
                              {t('buttons.review')}
                            </ButtonPrimary>
                          </MuiTooltip>
                        </StyledTd>
                        <StyledTd
                          style={{ textAlign: 'center' }}
                          rowSpan={numSubRows + (totalUnknown > 0 ? 1 : 0)}
                          className={isGroupHovered ? 'hover-highlight' : ''}
                        >
                          <MuiTooltip title={t('image_classification.remove_photo')}>
                            <ButtonCaution
                              type="button"
                              onClick={() => openRemovePhotoModal(file)}
                              aria-label={t('buttons.close')}
                            >
                              <IconClose aria-label={t('buttons.close')} />
                            </ButtonCaution>
                          </MuiTooltip>
                        </StyledTd>
                      </>
                    )}
                    {areValidationsShowing && subIndex >= 1 && (
                      <StyledTd>
                        {shouldDisplayObservationValidation && (
                          <ObservationValidationInfo
                            hasObservationErrorValidation={hasObservationErrorValidation}
                            hasObservationIgnoredValidation={hasObservationIgnoredValidation}
                            hasObservationWarningValidation={hasObservationWarningValidation}
                            ignoreObservationValidations={ignoreObservationValidations}
                            isObservationValid={isObservationValid}
                            observationId={obsId}
                            observationValidationMessages={observationValidationMessages}
                            observationValidationType={observationValidationType}
                            resetObservationValidations={resetObservationValidations}
                          />
                        )}
                      </StyledTd>
                    )}
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
                  <StyledTd style={{ textAlign: 'right' }}>{rowIndex++}</StyledTd>
                  <StyledTd style={{ textAlign: 'right' }}>{imageIndex + 1}</StyledTd>
                  <StyledTd colSpan={3} style={{ fontWeight: '700', textAlign: 'center' }}>
                    {t('image_classification.annotation.unclassified_points', {
                      count: totalUnknown,
                    })}
                  </StyledTd>
                  <StyledTd />
                </StyledTr>
              )}
            </React.Fragment>
          )
        })}
      </>
    )
  }

  return (
    <>
      <InputWrapper>
        <H2 id="table-label">{t('benthic_observations.observations')}</H2>
        <StyledOverflowWrapper>
          <StickyObservationTable aria-labelledby="table-label">
            <thead>
              <TableHeaderRow areValidationsShowing={areValidationsShowing} />
            </thead>

            {isFetching ? (
              <LoadingTableBody>
                <tr>
                  <td colSpan={8}>
                    <Spinner /> {t('loading')}...
                  </td>
                </tr>
              </LoadingTableBody>
            ) : (
              <tbody>
                <ComponentBreakdown />
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
                  (observationsSummaryStats[obs] / observationsSummaryStats?.total) * 100,
                )

                return (
                  obs !== 'total' && (
                    <Tr key={obs}>
                      <Th>% {obs}</Th>
                      <Td>{percentage}</Td>
                    </Tr>
                  )
                )
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
      {isRemovePhotoModalOpen && RemovePhotoModal}
    </>
  )
}

export default ImageClassificationObservationTable

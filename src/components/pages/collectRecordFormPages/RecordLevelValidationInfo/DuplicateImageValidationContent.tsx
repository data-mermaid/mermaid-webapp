import React from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

export interface Image {
  image_id: string
  collect_record_id: string
  benthicpqt_id: string
  original_image_name: string
}

interface DuplicateMessages {
  submittedMessage: string | null
  currentMessage: string | null
  otherMessage: string | null
}

interface DuplicateCategories {
  submitted: Image[]
  current: Image[]
  other: Image[]
}

const formatImageNames = (imgNames: string[], count: number, t: TFunction): string => {
  return t('image_classification.validations.image_names_interval', {
    postProcess: 'interval',
    count,
    firstImgName: imgNames[0],
    secondImgName: imgNames[1],
    thirdImgName: imgNames[2],
    moreCount: count - 3,
  })
}

const formatDuplicateImagesMessage = (
  images: Image[],
  locationKey: string,
  t: TFunction,
): string | null => {
  if (images.length === 0) {
    return null
  }

  const imgNames = images.slice(0, 3).map((img) => img.original_image_name)
  const count = images.length
  const location = t(locationKey)

  return t('image_classification.validations.duplicate_images', {
    count,
    imageNames: formatImageNames(imgNames, count, t),
    location,
  })
}

const deduplicateImagesByImageId = (images: Image[]): Image[] =>
  images.filter(
    (image, index, self) => index === self.findIndex((img) => img.image_id === image.image_id),
  )

const categorizeDuplicateImages = (
  uniqueDuplicates: Image[],
  imgId: string,
): DuplicateCategories => ({
  submitted: uniqueDuplicates.filter((image) => image.benthicpqt_id !== ''),
  current: uniqueDuplicates.filter((image) => image.collect_record_id === imgId),
  other: uniqueDuplicates.filter((image) => image.collect_record_id !== imgId),
})

const getDuplicateImageValidationContent = (
  duplicates: Record<string, Image[]> | undefined,
  imgId: string,
  t: TFunction,
): DuplicateMessages => {
  const duplicateImages = Object.values(duplicates || {}).flat()
  const uniqueDuplicates = deduplicateImagesByImageId(duplicateImages)
  const { submitted, current, other } = categorizeDuplicateImages(uniqueDuplicates, imgId)

  return {
    submittedMessage: formatDuplicateImagesMessage(
      submitted,
      'image_classification.validations.duplicate_submitted_transects',
      t,
    ),
    currentMessage: formatDuplicateImagesMessage(
      current,
      'image_classification.validations.duplicate_this_transect',
      t,
    ),
    otherMessage: formatDuplicateImagesMessage(
      other,
      'image_classification.validations.duplicate_other_transects',
      t,
    ),
  }
}

interface DuplicateImageValidationContentProps {
  duplicates: Record<string, Image[]> | undefined
  imgId: string
}

const DuplicateImageValidationContent = ({
  duplicates,
  imgId,
}: DuplicateImageValidationContentProps) => {
  const { t } = useTranslation()
  const { submittedMessage, currentMessage, otherMessage } = getDuplicateImageValidationContent(
    duplicates,
    imgId,
    t,
  )

  return (
    <>
      {submittedMessage && <p>{submittedMessage}</p>}
      {currentMessage && <p>{currentMessage}</p>}
      {otherMessage && <p>{otherMessage}</p>}
    </>
  )
}

export default DuplicateImageValidationContent

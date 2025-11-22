import React from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

interface Image {
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
  if (count === 1) {
    return t('image_classification.validations.image_name_format.one', { imgName: imgNames[0] })
  }
  if (count === 2) {
    return t('image_classification.validations.image_name_format.two', {
      firstImgName: imgNames[0],
      secondImgName: imgNames[1],
    })
  }
  if (count === 3) {
    return t('image_classification.validations.image_name_format.three', {
      firstImgName: imgNames[0],
      secondImgName: imgNames[1],
      thirdImgName: imgNames[2],
    })
  }
  return t('image_classification.validations.image_name_format.more', {
    firstImgName: imgNames[0],
    secondImgName: imgNames[1],
    thirdImgName: imgNames[2],
    count: count - 3,
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
      'image_classification.validations.duplicate_benthicpqt_image.submitted',
      t,
    ),
    currentMessage: formatDuplicateImagesMessage(
      current,
      'image_classification.validations.duplicate_benthicpqt_image.this',
      t,
    ),
    otherMessage: formatDuplicateImagesMessage(
      other,
      'image_classification.validations.duplicate_benthicpqt_image.other',
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

import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ImageClassificationObservationTable from './ImageClassificationObservationTable'
import ImageUploadModal from '../ImageUploadModal.jsx'
import { ButtonPrimary } from '../../../generic/buttons'
import { IconUpload } from '../../../icons'
import { ButtonContainer, IconContainer } from './ImageClassificationObservationTable.styles'
import { EXCLUDE_PARAMS_FOR_GET_ALL_IMAGES_IN_COLLECT_RECORD } from '../imageClassificationConstants'
import { getIsImageProcessed } from '../getIsImageProcessed'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImageClassificationImage } from '../../../../types/ImageClassificationTypes'

// const testingImageData: ImageClassificationImage = {
//   id: 'test-image-id',
//   updated_by: 'test-user',
//   classification_status: {
//     id: 'test-status-id',
//     image: 'test-image-id',
//     status: IMAGE_CLASSIFICATION_STATUS.failed,
//     message: null,
//   },
//   patch_size: 100,
//   num_confirmed: 5,
//   num_unconfirmed: 2,
//   num_unclassified: 0,
//   points: [],
//   created_on: '2023-10-01T00:00:00Z',
//   updated_on: '2023-10-01T00:00:00Z',
//   collect_record_id: 'test-collect-record-id',
//   image: 'test-image-url',
//   thumbnail: 'test-thumbnail-url',
//   name: 'Test Image',
//   original_image_name: 'original-test-image.jpg',
//   original_image_width: 1920,
//   original_image_height: 1580,
//   photo_timestamp: null,
//   location: null,
//   comments: null,
//   data: {},
// }

const ImageClassificationContainer = (props) => {
  const { t } = useTranslation()
  const { isImageClassificationEnabledForUser } = props
  const [images, setImages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId, recordId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isUploadingRef = useRef(isUploading) // we use a ref for state here so that we can access non-stale value from within setInterval callbacks

  const handleFilesUpload = () => {
    setIsModalOpen(false)
  }

  useEffect(
    function syncronizeIsUploadingRefWithState() {
      // we use a ref for state here so that we can access
      // non-stale value from within setInterval callback closures
      isUploadingRef.current = isUploading
    },
    [isUploading],
  )

  const pollCollectRecordUntilAllImagesProcessed = () => {
    if (!databaseSwitchboardInstance || !handleHttpResponseError || !projectId || !recordId) {
      throw new Error('pollCollectRecordUntilAllImagesProcessed has missing dependencies')
    }
    let intervalId

    const pollCollectRecordForImages = async () => {
      try {
        const response = await databaseSwitchboardInstance.getAllImagesInCollectRecord(
          projectId,
          recordId,
          EXCLUDE_PARAMS_FOR_GET_ALL_IMAGES_IN_COLLECT_RECORD,
        )

        setImages(response.results)

        // if an upload is slow, this may return true before
        // the upload is complete if previously processed images are present
        const areAllUploadedImagesProcessed =
          response.results.length &&
          response.results.every((file) => getIsImageProcessed(file.classification_status?.status))

        // ... so we need to check if any images are still being uploaded as well
        // (since useState values will be stale within a closure/setInterval callback,
        // we use a reference to access the current value for isUploading instead of the stale closure value directly)
        const areMoreImagesStillBeingUploaded = isUploadingRef.current
        if (areAllUploadedImagesProcessed && !areMoreImagesStillBeingUploaded) {
          clearTimeout(intervalId)
        } else {
          intervalId = setTimeout(pollCollectRecordForImages, 5000)
        }
      } catch (error) {
        handleHttpResponseError({
          error,
          callback: () => {
            console.error('Error polling images:', error)
          },
          shouldShowServerNonResponseMessage: false,
        })
        intervalId = setTimeout(pollCollectRecordForImages, 5000)
      }
    }

    pollCollectRecordForImages()
  }

  return (
    <>
      <ImageClassificationObservationTable
        images={images}
        isUploading={isUploading}
        setImages={setImages}
        {...props}
      />
      <ButtonContainer>
        {isImageClassificationEnabledForUser ? (
          <ButtonPrimary
            id="gtm-collect-record-upload-photos"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            <IconContainer>
              <IconUpload />
            </IconContainer>
            {t('image_classification.buttons.upload_photos')}
          </ButtonPrimary>
        ) : (
          <>{t('image_classification.errors.no_classification_enabled')}</>
        )}
      </ButtonContainer>
      {isModalOpen && (
        <ImageUploadModal
          onClose={() => setIsModalOpen(false)}
          onFilesUpload={handleFilesUpload}
          setIsUploading={setIsUploading}
          isOpen={isModalOpen}
          existingFiles={images}
          pollCollectRecordUntilAllImagesProcessed={pollCollectRecordUntilAllImagesProcessed}
        />
      )}
    </>
  )
}

export default ImageClassificationContainer

ImageClassificationContainer.propTypes = {
  isImageClassificationEnabledForUser: PropTypes.bool.isRequired,
}

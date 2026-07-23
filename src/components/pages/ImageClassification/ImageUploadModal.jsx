import React, { useRef } from 'react'
import { useParams } from 'react-router'
import PropTypes from 'prop-types'
import Modal from '../../generic/Modal'
import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../../generic/buttons.js'
import { toast } from 'react-toastify'
import { isCancel } from 'axios'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext.jsx'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext.jsx'
import { getToastArguments } from '../../../library/getToastArguments'
import { Trans, useTranslation } from 'react-i18next'
import preCropPhoto from '../../../assets/negative-photo-upload-cropping.png'
import postCropPhoto from '../../../assets/positive-user-photo-cropping.png'
import cropTransitionIcon from '../../../assets/photo-crop-arrow-transition.svg'
import styles from '../../../style/ImageUploadModal.module.scss'
import imageClassificationLinks from '../../../link_constants.js'
import {
  MAX_IMAGE_UPLOAD_SIZE,
  VALID_IMAGE_TYPES,
  MAX_IMAGE_WIDTH_HEIGHT,
  MIN_IMAGE_WIDTH_HEIGHT,
  MAX_IMAGE_UPLOAD_SIZE_MB,
} from '../../../library/constants/constants'

const renderUploadProgress = (processedCount, totalFiles, handleCancelUpload) => (
  <Trans
    i18nKey="media.uploading_files"
    components={{
      p: <p />,
      button: <ButtonCaution type="button" onClick={handleCancelUpload} />,
    }}
    values={{
      processedCount: processedCount,
      totalCount: totalFiles,
    }}
  />
)

const ImageUploadModal = ({
  existingFiles,
  isOpen,
  onClose,
  onFilesUpload,
  pollCollectRecordUntilAllImagesProcessed,
  setIsUploading,
}) => {
  const { t } = useTranslation()
  const isCancelledRef = useRef(false)
  const abortControllerRef = useRef(null)
  const fileInputRef = useRef(null)
  const { recordId, projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const toastId = useRef(null)
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const validateDimensions = (file) => {
    return new Promise((resolve) => {
      if (isCancelledRef.current) {
        return resolve({ file, valid: false, cancelled: true })
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (isCancelledRef.current) {
          return resolve({ file, valid: false, cancelled: true })
        }

        const img = new Image()
        img.onload = () => {
          if (isCancelledRef.current) {
            return resolve({ file, valid: false, cancelled: true })
          }

          if (img.width < MIN_IMAGE_WIDTH_HEIGHT || img.height < MIN_IMAGE_WIDTH_HEIGHT) {
            return resolve({ file, valid: false, isImageTooSmall: true })
          }

          if (img.width <= MAX_IMAGE_WIDTH_HEIGHT && img.height <= MAX_IMAGE_WIDTH_HEIGHT) {
            return resolve({ file, valid: true })
          } else {
            return resolve({ file, valid: false })
          }
        }
        img.onerror = () => {
          return resolve({ file, valid: false, corrupt: true })
        }
        img.src = event.target.result

        return null
      }
      reader.onerror = () => {
        return resolve({ file, valid: false, corrupt: true })
      }
      reader.readAsDataURL(file)

      return null
    })
  }

  const processSingleImage = async (file, signal) => {
    try {
      const imageData = await databaseSwitchboardInstance.uploadImage(
        projectId,
        recordId,
        file,
        signal,
      )

      return imageData
    } catch (error) {
      if (isCancel(error)) {
        return null
      }
      handleHttpResponseError({
        error,
        callback: () => {
          toast.error(
            ...getToastArguments(
              `${t('media.errors.failed_uploaded', { fileName: file.name })}: ${error.message}`,
            ),
          )
        },
        shouldShowServerNonResponseMessage: false,
      })
      return null
    }
  }

  const validateFileSync = (file) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      return `${t('image_classification.errors.invalid_file_type')}: ${file.name}`
    }
    if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
      return `${t('image_classification.errors.file_too_big')}: ${file.name}`
    }
    if (existingFiles.some((existingFile) => existingFile.original_image_name === file.name)) {
      return t('image_classification.errors.duplicate_file', { fileName: file.name })
    }
    return null
  }

  const validateAndUploadFiles = async (files) => {
    onClose()
    setIsUploading(true)
    isCancelledRef.current = false

    const uploadedFiles = []

    for (const file of files) {
      if (isCancelledRef.current) {
        setIsUploading(false)
        return
      }

      // Validate file type, size, and uniqueness synchronously before showing the upload toast.
      // The toast is created lazily (below, before the first async operation) so that if all
      // files fail these synchronous checks — e.g. all are duplicates — no upload toast appears.
      const syncError = validateFileSync(file)
      if (syncError) {
        toast.error(syncError)
        continue
      }

      // Creating the toast here (rather than before the loop) ensures React has a chance to
      // render it before any dismissal, avoiding a race condition where toast.dismiss() fires
      // before the toast is committed.
      if (!toastId.current) {
        toastId.current = toast.info(renderUploadProgress(0, files.length, handleCancelUpload), {
          autoClose: false,
        })
      }

      const result = await validateDimensions(file)
      if (!result.valid || result.corrupt) {
        if (result.isImageTooSmall) {
          toast.error(
            t('image_classification.errors.photo_too_small', {
              fileName: file.name,
              minImageWidthAndHeight: MIN_IMAGE_WIDTH_HEIGHT,
            }),
          )
        } else {
          toast.error(
            `${t('media.accepted_photo_types')} ${t('image_classification.errors.invalid_file', {
              fileName: file.name,
            })}`,
          )
        }
        continue
      }

      if (isCancelledRef.current) {
        setIsUploading(false)
        return
      }

      abortControllerRef.current = new AbortController()
      const uploadedFile = await processSingleImage(file, abortControllerRef.current.signal)

      if (uploadedFile) {
        if (uploadedFiles.length === 0) {
          // start polling only after the first successful upload to avoid unnecessary API calls
          pollCollectRecordUntilAllImagesProcessed()
        }
        uploadedFiles.push(uploadedFile)
        onFilesUpload(uploadedFile)
        if (toastId.current) {
          toast.update(toastId.current, {
            render: renderUploadProgress(uploadedFiles.length, files.length, handleCancelUpload),
          })
        }
      }

      if (isCancelledRef.current) {
        setIsUploading(false)
        return
      }
    }

    if (uploadedFiles.length > 0) {
      if (toastId.current) {
        toast.update(toastId.current, {
          render: t('image_classification.success.file_upload', { count: uploadedFiles.length }),
          type: 'success',
          autoClose: true,
        })
      }
    } else if (toastId.current) {
      toast.dismiss(toastId.current)
    }

    toastId.current = null
    setIsUploading(false)
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    validateAndUploadFiles(files)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    validateAndUploadFiles(files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleCancelUpload = () => {
    isCancelledRef.current = true
    abortControllerRef.current?.abort()

    toast.info(t('media.upload_cancelled'))
    if (toastId.current) {
      toast.dismiss(toastId.current)
      toastId.current = null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      title={t('image_classification.buttons.upload_photos')}
      maxWidth="80rem"
      padding="0.5rem"
      displayCloseIcon={false}
      mainContent={
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
          <div
            className={styles['drop-zone']}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleButtonClick}
          >
            <Trans i18nKey="media.put_files_here" components={{ br: <br /> }} />
            <ButtonPrimary type="button">{t('media.select_local_files')}</ButtonPrimary>
            <input
              type="file"
              multiple
              className={styles['hidden-input']}
              onChange={handleFileChange}
              ref={fileInputRef}
              accept={VALID_IMAGE_TYPES.join(',')}
            />
          </div>
          <div className={styles['image-guidelines']}>
            <ul>
              <li>{t('media.min_image_size', { imgWidthHeight: MIN_IMAGE_WIDTH_HEIGHT })}</li>
              <li>{t('media.max_file_size', { fileSize: MAX_IMAGE_UPLOAD_SIZE_MB })}</li>
              <li>{t('media.req_crop_photos')}</li>
              <li>
                <Trans
                  i18nKey="media.user_guidance.more_photo_upload_info"
                  components={{
                    a: (
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a
                        href={imageClassificationLinks.photoPreparationDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              </li>
            </ul>
            <div className={styles['image-guidelines__div']}>
              <img
                className={styles['image-guidelines__img']}
                src={preCropPhoto}
                alt={t('media.user_guidance.uncropped_photo_example')}
              />
              <img
                className={styles['image-guidelines__img']}
                src={cropTransitionIcon}
                alt={t('media.user_guidance.crop_icon')}
              />
              <img
                className={styles['image-guidelines__img']}
                src={postCropPhoto}
                alt={t('media.user_guidance.cropped_photo_example')}
              />
            </div>
          </div>
        </>
      }
      footerContent={
        <div className={styles['button-container']}>
          <ButtonSecondary type="button" onClick={onClose}>
            {t('buttons.close')}
          </ButtonSecondary>
        </div>
      }
    />
  )
}

ImageUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilesUpload: PropTypes.func.isRequired,
  existingFiles: PropTypes.array.isRequired,
  setIsUploading: PropTypes.func.isRequired,
  pollCollectRecordUntilAllImagesProcessed: PropTypes.func.isRequired,
}

export default ImageUploadModal

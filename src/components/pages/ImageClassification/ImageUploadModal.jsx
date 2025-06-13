import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Modal from '../../generic/Modal/index.js'
import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../../generic/buttons.js'
import { toast } from 'react-toastify'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext.jsx'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext.jsx'
import { getToastArguments } from '../../../library/getToastArguments.js'
import { Trans, useTranslation } from 'react-i18next'
import preCropPhoto from '../../../assets/negative-photo-upload-cropping.png'
import postCropPhoto from '../../../assets/positive-user-photo-cropping.png'
import cropTransitionIcon from '../../../assets/photo-crop-arrow-transition.png'
import styles from '../../../style/ImageUploadModal.module.scss'
import imageClassificationLinks from '../../../link_constants.js'

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
  const fileInputRef = useRef(null)
  const { recordId, projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const toastId = useRef(null)
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const validFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
  const maxFileSize = 30 * 1024 * 1024 // 30 MB
  const minImageWidthAndHeight = 1500
  const maxWidth = 8000
  const maxHeight = 8000

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

          if (img.width < minImageWidthAndHeight || img.height < minImageWidthAndHeight) {
            return resolve({ file, valid: false, isImageTooSmall: true })
          }

          if (img.width <= maxWidth && img.height <= maxHeight) {
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

  const processSingleImage = async (file) => {
    try {
      const imageData = await databaseSwitchboardInstance.uploadImage(projectId, recordId, file)

      return imageData
    } catch (error) {
      handleHttpResponseError({
        error,
        callback: () => {
          toast.error(...getToastArguments(`Failed to upload ${file.name}: ${error.message}`))
        },
        shouldShowServerNonResponseMessage: false,
      })
      return null
    }
  }

  const validateAndUploadFiles = async (files) => {
    onClose()
    setIsUploading(true)

    // Show the persistent uploading toast and store the toastId
    if (!toastId.current) {
      toastId.current = toast.info(renderUploadProgress(0, files.length, handleCancelUpload), {
        autoClose: false,
      })
    }

    isCancelledRef.current = false

    const uploadedFiles = []
    let processedCount = 0

    for (const file of files) {
      if (isCancelledRef.current) {
        setIsUploading(false)
        return
      }

      // Validate file type, size, dimensions, and uniqueness.
      if (!validFileTypes.includes(file.type)) {
        toast.error(`${t('image_classification.errors.invalid_file_type')}: ${file.name}`)
        continue
      }
      if (file.size > maxFileSize) {
        toast.error(`${t('image_classification.errors.file_too_big')}: ${file.name}`)
        continue
      }

      if (existingFiles.some((existingFile) => existingFile.original_image_name === file.name)) {
        toast.error(t('image_classification.errors.duplicate_file', { fileName: file.name }))
        continue
      }

      const result = await validateDimensions(file)
      if (!result.valid || result.corrupt) {
        if (result.isImageTooSmall) {
          toast.error(
            t('image_classification.errors.photo_too_small', {
              fileName: file.name,
              minImageWidthAndHeight: minImageWidthAndHeight,
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

      // Start processing the file as soon as it's validated.
      const uploadedFile = await processSingleImage(file)
      const isFirstUploadedFile = uploadedFile && uploadedFiles.length === 0
      if (isFirstUploadedFile) {
        // wait for first image to be successfully
        // uploaded before initiating polling
        // to avoid hitting the API unecessarily
        pollCollectRecordUntilAllImagesProcessed()
      }
      if (uploadedFile) {
        uploadedFiles.push(uploadedFile)
        onFilesUpload()

        processedCount += 1

        if (toastId.current) {
          toast.update(toastId.current, {
            render: renderUploadProgress(processedCount, files.length, handleCancelUpload),
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
          type: toast.TYPE.SUCCESS,
          autoClose: true,
        })
      }
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
              accept={validFileTypes.join(',')}
            />
          </div>
          <div className={styles['image-guidelines']}>
            <ul>
              <li>{t('media.min_image_size')}</li>
              <li>{t('media.max_file_size')}</li>
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

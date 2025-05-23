import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal'
import { ButtonPrimary, ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import { DropZone, HiddenInput, ButtonContainer } from './ImageUploadModal.styles'
import { toast } from 'react-toastify'
import language from '../../../../language'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { getToastArguments } from '../../../../library/getToastArguments'

const renderUploadProgress = (processedCount, totalFiles, handleCancelUpload) => (
  <div>
    <p>
      Uploading {processedCount}/{totalFiles} images...
    </p>
    <ButtonCaution type="button" onClick={handleCancelUpload}>
      Cancel Upload
    </ButtonCaution>
  </div>
)

const ImageUploadModal = ({
  existingFiles,
  isOpen,
  onClose,
  onFilesUpload,
  pollCollectRecordUntilAllImagesProcessed,
  setIsUploading,
}) => {
  const isCancelledRef = useRef(false)
  const fileInputRef = useRef(null)
  const { recordId, projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const toastId = useRef(null)
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const validFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
  const maxFileSize = 30 * 1024 * 1024 // 30 MB
  const minImageWidthAndHeight = 1124
  const maxWidth = 8000
  const maxHeight = 8000
  const uploadText = language.imageClassification.imageClassficationModal

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
        toast.error(
          `${language.imageClassification.imageUploadNotification.fileTypeInvalid}: ${file.name}`,
        )
        continue
      }
      if (file.size > maxFileSize) {
        toast.error(
          `${language.imageClassification.imageUploadNotification.fileSizeExceedsLimit}: ${file.name}`,
        )
        continue
      }

      if (existingFiles.some((existingFile) => existingFile.original_image_name === file.name)) {
        toast.error(
          `${language.imageClassification.imageUploadNotification.duplicateFile}: ${file.name}`,
        )
        continue
      }

      const result = await validateDimensions(file)
      if (!result.valid || result.corrupt) {
        if (result.isImageTooSmall) {
          toast.error(
            `${language.imageClassification.imageUploadNotification.imageTooSmall}: ${file.name}`,
          )
        } else {
          toast.error(
            `${language.imageClassification.imageUploadNotification.fileInvalidOrCorrupt}: ${file.name}`,
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
          render: uploadText.success,
          type: toast.TYPE.SUCCESS,
          autoClose: true,
        })
      }
    }

    if (toastId.current) {
      toast.dismiss(toastId.current)
      toastId.current = null
    }

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

    toast.info('Upload cancelled.')
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      title="Upload Photos"
      maxWidth="80rem"
      padding="0.5rem"
      displayCloseIcon={false}
      mainContent={
        <>
          <DropZone onDrop={handleDrop} onDragOver={handleDragOver} onClick={handleButtonClick}>
            Drop files here
            <br />
            or
            <br />
            <ButtonPrimary type="button">Select files from your computer...</ButtonPrimary>
            <HiddenInput
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              accept={validFileTypes.join(',')}
            />
          </DropZone>
        </>
      }
      footerContent={
        <ButtonContainer>
          <ButtonSecondary type="button" onClick={onClose}>
            {language.buttons.close}
          </ButtonSecondary>
        </ButtonContainer>
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

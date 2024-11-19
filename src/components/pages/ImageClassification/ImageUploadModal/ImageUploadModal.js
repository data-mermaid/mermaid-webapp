import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal'
import { ButtonPrimary, ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import { DropZone, HiddenInput, ButtonContainer } from './ImageUploadModal.styles'
import { toast } from 'react-toastify'
import language from '../../../../language'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

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

const ImageUploadModal = ({ isOpen, onClose, onFilesUpload, existingFiles, isUploading }) => {
  const isCancelledRef = useRef(false)
  const fileInputRef = useRef(null)
  const { recordId, projectId } = useParams()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const toastId = useRef(null)

  const validFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
  const maxFileSize = 30 * 1024 * 1024 // 30 MB
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

          if (img.width <= maxWidth && img.height <= maxHeight) {
            resolve({ file, valid: true })
          } else {
            resolve({ file, valid: false })
          }
        }
        img.onerror = () => {
          resolve({ file, valid: false, corrupt: true })
        }
        img.src = event.target.result
      }
      reader.onerror = () => {
        resolve({ file, valid: false, corrupt: true })
      }
      reader.readAsDataURL(file)
    })
  }

  const processSingleImage = async (file) => {
    try {
      const imageData = await databaseSwitchboardInstance.uploadImage(projectId, recordId, file)

      return imageData
    } catch (error) {
      toast.error(`Failed to upload ${file.name}: ${error.message}`)
      return null
    }
  }

  const validateAndUploadFiles = async (files) => {
    onClose()
    isUploading(true)

    // Show the persistent uploading toast and store the toastId
    if (!toastId.current) {
      toastId.current = toast.info(renderUploadProgress(0, files.length, handleCancelUpload))
    }

    isCancelledRef.current = false

    const uploadedFiles = []
    let processedCount = 0

    for (const file of files) {
      if (isCancelledRef.current) {
        isUploading(false)
        return
      }

      // Validate file type, size, dimensions, and uniqueness.
      if (!validFileTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`)
        continue
      }
      if (file.size > maxFileSize) {
        toast.error(`File size exceeds the limit: ${file.name}`)
        continue
      }

      if (existingFiles.some((existingFile) => existingFile.original_image_name === file.name)) {
        toast.error(`Duplicate file: ${file.name}`)
        continue
      }

      const result = await validateDimensions(file)
      if (!result.valid || result.corrupt) {
        toast.error(`File is invalid or corrupt: ${file.name}`)
        continue
      }

      // Start processing the file as soon as it's validated.
      const uploadedFile = await processSingleImage(file)
      if (uploadedFile) {
        uploadedFiles.push(uploadedFile)
        onFilesUpload(uploadedFiles)

        processedCount += 1

        if (toastId.current) {
          toast.update(toastId.current, {
            render: renderUploadProgress(processedCount, files.length, handleCancelUpload),
          })
        }
      }

      if (isCancelledRef.current) {
        isUploading(false)
        return
      }
    }

    if (uploadedFiles.length > 0) {
      if (toastId.current) {
        toast.update(toastId.current, {
          render: uploadText.success,
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        })
      }
    }

    if (toastId.current) {
      toast.dismiss(toastId.current)
      toastId.current = null
    }

    isUploading(false)
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
            Close
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
  isUploading: PropTypes.func.isRequired,
}

export default ImageUploadModal

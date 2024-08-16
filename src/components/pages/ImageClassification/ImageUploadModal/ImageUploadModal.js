import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal'
import { ButtonPrimary, ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import { DropZone, HiddenInput, ButtonContainer } from './ImageUploadModal.styles'
import { toast } from 'react-toastify'
import language from '../../../../language'

const ImageUploadModal = ({ isOpen, onClose, onFilesUpload, existingFiles }) => {
  const [loading, setLoading] = useState(false)
  const [totalFiles, setTotalFiles] = useState(0)
  const [processedFiles, setProcessedFiles] = useState(0)
  const isCancelledRef = useRef(false) // Use ref for cancellation flag - more reliable because refs update synchronously
  const fileInputRef = useRef(null)

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

  const validateAndUploadFiles = async (files) => {
    setLoading(true)
    setTotalFiles(files.length)
    setProcessedFiles(0)
    isCancelledRef.current = false

    const validFiles = []
    const invalidFiles = []
    const duplicateFiles = []
    const oversizedFiles = []
    const dimensionExceededFiles = []
    const corruptFiles = []

    const allFiles = [...existingFiles]

    for (const [index, file] of files.entries()) {
      if (isCancelledRef.current) {
        setLoading(false)
        return
      }

      if (!validFileTypes.includes(file.type)) {
        invalidFiles.push(file)
      } else if (file.size > maxFileSize) {
        oversizedFiles.push(file)
      } else if (allFiles.some((existingFile) => existingFile.name === file.name)) {
        duplicateFiles.push(file)
      } else {
        const result = await validateDimensions(file)
        if (isCancelledRef.current || result.cancelled) {
          setLoading(false)
          return
        }

        if (result.valid && !result.corrupt) {
          validFiles.push(result.file)
        } else if (result.corrupt) {
          corruptFiles.push(result.file)
        } else {
          dimensionExceededFiles.push(result.file)
        }
      }

      setProcessedFiles(index + 1)
    }

    if (isCancelledRef.current) {
      setLoading(false)
      return
    }

    if (validFiles.length > 0) {
      onFilesUpload(validFiles)
    }

    if (duplicateFiles.length > 0) {
      toast.error(uploadText.errors.duplicateFiles)
    }

    if (invalidFiles.length > 0) {
      toast.error(uploadText.errors.invalidFiles)
    }

    if (oversizedFiles.length > 0) {
      toast.error(uploadText.errors.oversizedFiles)
    }

    if (dimensionExceededFiles.length > 0) {
      toast.error(uploadText.errors.dimensionExceededFiles)
    }

    if (corruptFiles.length > 0) {
      toast.error(uploadText.errors.corruptFiles)
    }

    if (validFiles.length > 0) {
      toast.success(uploadText.success)
    }

    setLoading(false)
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
    setLoading(false)
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
          {loading ? (
            <div>
              Uploading {processedFiles}/{totalFiles} images...
            </div>
          ) : (
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
          )}
        </>
      }
      footerContent={
        <ButtonContainer>
          {loading ? (
            <ButtonCaution type="button" onClick={handleCancelUpload}>
              Cancel Upload
            </ButtonCaution>
          ) : (
            <ButtonSecondary type="button" onClick={onClose} disabled={loading}>
              Close
            </ButtonSecondary>
          )}
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
}

export default ImageUploadModal

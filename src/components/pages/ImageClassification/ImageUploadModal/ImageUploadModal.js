import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal'
import { ButtonPrimary } from '../../../generic/buttons'
import { DropZone, HiddenInput } from './ImageUploadModal.styles'
import { toast } from 'react-toastify'
import language from '../../../../language'

const ImageUploadModal = ({ isOpen, onClose, onFilesUpload, existingFiles }) => {
  const [loading, setLoading] = useState(false)
  const [totalFiles, setTotalFiles] = useState(0)
  const [processedFiles, setProcessedFiles] = useState(0)
  const fileInputRef = useRef(null)

  const validFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
  const maxFileSize = 30 * 1024 * 1024 // 30 MB
  const maxWidth = 8000
  const maxHeight = 8000
  const errorText = language.imageClassification.imageClassficationModal.errors

  const validateDimensions = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
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
    setProcessedFiles(0) // Reset the processed files count

    const validFiles = []
    const invalidFiles = []
    const duplicateFiles = []
    const oversizedFiles = []
    const dimensionExceededFiles = []
    const corruptFiles = []

    const allFiles = [...existingFiles]

    for (const [index, file] of files.entries()) {
      if (!validFileTypes.includes(file.type)) {
        invalidFiles.push(file)
      } else if (file.size > maxFileSize) {
        oversizedFiles.push(file)
      } else if (allFiles.some((existingFile) => existingFile.name === file.name)) {
        duplicateFiles.push(file)
      } else {
        const result = await validateDimensions(file)
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

    if (duplicateFiles.length > 0) {
      toast.error(errorText.duplicateFiles)
    }

    if (invalidFiles.length > 0) {
      toast.error(errorText.invalidFiles)
    }

    if (oversizedFiles.length > 0) {
      toast.error(errorText.oversizedFiles)
    }

    if (dimensionExceededFiles.length > 0) {
      toast.error(errorText.dimensionExceededFiles)
    }

    if (corruptFiles.length > 0) {
      toast.error(errorText.corruptFiles)
    }

    if (validFiles.length > 0) {
      onFilesUpload(validFiles)
      if (
        invalidFiles.length === 0 &&
        duplicateFiles.length === 0 &&
        oversizedFiles.length === 0 &&
        dimensionExceededFiles.length === 0 &&
        corruptFiles.length === 0
      ) {
        toast.success('Files uploaded successfully')
      }
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

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      title="Upload Photos"
      maxWidth="80rem"
      padding="0.5rem"
      mainContent={
        <>
          {loading ? (
            <div>
              Uploading {processedFiles}/{totalFiles} images...
            </div>
          ) : (
            <DropZone onDrop={handleDrop} onDragOver={handleDragOver}>
              Drop files here
              <br />
              or
              <br />
              <ButtonPrimary type="button" onClick={handleButtonClick}>
                Select files from your computer...
              </ButtonPrimary>
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
        <div>
          <ButtonPrimary type="button" onClick={onClose} disabled={loading}>
            Close
          </ButtonPrimary>
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
}

export default ImageUploadModal

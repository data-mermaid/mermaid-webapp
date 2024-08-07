import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../generic/Modal'
import { ButtonPrimary } from '../../generic/buttons'
import { DropZone, HiddenInput } from './ImageUploadModal.styles'
import { toast } from 'react-toastify'

const ImageUploadModal = ({ isOpen, onClose, onFilesUpload, existingFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const validFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
  const maxFileSize = 30 * 1024 * 1024 // 30 MB in bytes

  const validateAndUploadFiles = (files) => {
    const validFiles = []
    const invalidFiles = []
    const duplicateFiles = []
    const oversizedFiles = []

    const allFiles = [...existingFiles, ...selectedFiles]

    files.forEach((file) => {
      if (!validFileTypes.includes(file.type)) {
        invalidFiles.push(file)
      } else if (file.size > maxFileSize) {
        oversizedFiles.push(file)
      } else if (allFiles.some((existingFile) => existingFile.name === file.name)) {
        duplicateFiles.push(file)
      } else {
        validFiles.push(file)
      }
    })

    if (duplicateFiles.length > 0) {
      toast.error('Some files are duplicates and were not added.')
    }

    if (invalidFiles.length > 0) {
      toast.error(
        'Some files were not added due to invalid file types. Only JPEG, PJPEG, PNG, and MPO files are allowed.',
      )
    }

    if (oversizedFiles.length > 0) {
      toast.error('Some files were not added because they exceed the 30 MB size limit.')
    }

    if (invalidFiles.length === 0 && duplicateFiles.length === 0 && validFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles])
      onFilesUpload([...selectedFiles, ...validFiles])
      toast.success('Files uploaded successfully')
    }
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
        <DropZone onDrop={handleDrop} onDragOver={handleDragOver}>
          Drop files here
          <br />
          or
          <br />
          <ButtonPrimary type="button" onClick={handleButtonClick}>
            Select files from your computer...
          </ButtonPrimary>
          <HiddenInput type="file" multiple onChange={handleFileChange} ref={fileInputRef} />
        </DropZone>
      }
      footerContent={
        <div>
          <ButtonPrimary type="button" onClick={onClose}>
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

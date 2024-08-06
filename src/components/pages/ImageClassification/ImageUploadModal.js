import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../generic/Modal'
import { ButtonPrimary } from '../../generic/buttons'
import { DropZone, HiddenInput } from './ImageUploadModal.styles'

const ImageUploadModal = ({ isOpen, onClose, onFilesUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles([...selectedFiles, ...files])
    onFilesUpload([...selectedFiles, ...files])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setSelectedFiles([...selectedFiles, ...files])
    onFilesUpload([...selectedFiles, ...files])
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
}

export default ImageUploadModal

import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { ButtonPrimary } from '../../generic/buttons'
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  DropZone,
  HiddenInput,
} from './ImageUploadModal.styles'

const ImageUploadModal = ({ onClose, onFilesUpload }) => {
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

  const handleRemoveFile = (file) => {
    const updatedFiles = selectedFiles.filter((f) => f !== file)
    setSelectedFiles(updatedFiles)
    onFilesUpload(updatedFiles)
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Upload Photos</h2>
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
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} <button onClick={() => handleRemoveFile(file)}>Remove</button>
            </li>
          ))}
        </ul>
      </ModalContent>
    </ModalOverlay>
  )
}

ImageUploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFilesUpload: PropTypes.func.isRequired,
}

export default ImageUploadModal

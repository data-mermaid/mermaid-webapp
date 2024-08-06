import React, { useState } from 'react'
import ImageClassificationObservationTable from './ImageClassificationObservationTable'
import ImageUploadModal from './ImageUploadModal'
import { ButtonPrimary } from '../../generic/buttons'
import { IconUpload } from '../../icons'
import { ButtonContainer, IconContainer } from './ImageClassificationObservationTable.styles'
import { toast } from 'react-toastify'

const ImageClassificationContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFilesUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files])
    toast.success('Files uploaded successfully')
    setIsModalOpen(false)
  }

  const handleRemoveFile = (file) => {
    const updatedFiles = uploadedFiles.filter((f) => f !== file)
    setUploadedFiles(updatedFiles)
    toast.warn('File removed')
  }

  return (
    <>
      <ImageClassificationObservationTable
        uploadedFiles={uploadedFiles}
        handleRemoveFile={handleRemoveFile}
      />
      <ButtonContainer>
        <ButtonPrimary type="button" onClick={() => setIsModalOpen(true)}>
          <IconContainer>
            <IconUpload />
          </IconContainer>
          Upload Photos
        </ButtonPrimary>
      </ButtonContainer>
      {isModalOpen && (
        <ImageUploadModal
          onClose={() => setIsModalOpen(false)}
          onFilesUpload={handleFilesUpload}
          isOpen={isModalOpen}
        />
      )}
    </>
  )
}

export default ImageClassificationContainer

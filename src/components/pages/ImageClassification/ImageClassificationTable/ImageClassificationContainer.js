import React, { useState } from 'react'
import ImageClassificationObservationTable from './ImageClassificationObservationTable'
import ImageUploadModal from '../ImageUploadModal/ImageUploadModal'
import { ButtonPrimary } from '../../../generic/buttons'
import { IconUpload } from '../../../icons'
import { ButtonContainer, IconContainer } from './ImageClassificationObservationTable.styles'

const ImageClassificationContainer = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files])
    setIsModalOpen(false)
  }

  return (
    <>
      <ImageClassificationObservationTable
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        isUploading={isUploading}
        {...props}
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
          setIsUploading={setIsUploading}
          isOpen={isModalOpen}
          existingFiles={uploadedFiles}
        />
      )}
    </>
  )
}

export default ImageClassificationContainer

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

  return (
    <>
      <ImageClassificationObservationTable uploadedFiles={uploadedFiles} />
      <ButtonContainer>
        <ButtonPrimary type="button" onClick={() => setIsModalOpen(true)}>
          <IconContainer>
            <IconUpload />
          </IconContainer>
          Upload Photos
        </ButtonPrimary>
      </ButtonContainer>
      {isModalOpen && (
        <ImageUploadModal onClose={() => setIsModalOpen(false)} onFilesUpload={handleFilesUpload} />
      )}
    </>
  )
}

export default ImageClassificationContainer

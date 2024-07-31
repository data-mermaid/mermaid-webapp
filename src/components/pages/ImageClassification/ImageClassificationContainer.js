import React, { useState } from 'react'
import ImageClassificationObservationTable from './ImageClassificationObservationTable'
import ImageUploadModal from './ImageUploadModal'
import { ButtonPrimary } from '../../generic/buttons'
import { IconUpload } from '../../icons'
import { IconContainer } from './ImageClassificationObservationTable.styles'

const ImageClassificationContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFilesUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files])
  }

  console.log({ uploadedFiles })

  return (
    <div>
      <ImageClassificationObservationTable uploadedFiles={uploadedFiles} />
      <ButtonPrimary type="button" onClick={() => setIsModalOpen(true)}>
        <IconContainer>
          <IconUpload />
        </IconContainer>
        Upload Photos
      </ButtonPrimary>
      {isModalOpen && (
        <ImageUploadModal onClose={() => setIsModalOpen(false)} onFilesUpload={handleFilesUpload} />
      )}
    </div>
  )
}

export default ImageClassificationContainer

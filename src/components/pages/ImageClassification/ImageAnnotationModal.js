import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../../generic/Modal/Modal'

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`

const ImageAnnotationModal = ({ isModalDisplayed, setIsModalDisplayed }) => {
  const handleCloseModal = () => {
    // TODO: Save content before closing
    setIsModalDisplayed(false)
  }

  return (
    <Modal
      title="Placeholder value for image name"
      isOpen={isModalDisplayed}
      onDismiss={handleCloseModal}
      maxWidth="100%"
      mainContent={
        <div>
          Quadrat: <b>4</b>
          <p>table goes here</p>
          <p>image / map goes here</p>
        </div>
      }
      footerContent={
        <Footer>
          <div>legend goes here</div>
          <button onClick={handleCloseModal}>Close</button>
        </Footer>
      }
    />
  )
}

ImageAnnotationModal.propTypes = {
  isModalDisplayed: PropTypes.bool.isRequired,
  setIsModalDisplayed: PropTypes.func.isRequired,
}

export default ImageAnnotationModal

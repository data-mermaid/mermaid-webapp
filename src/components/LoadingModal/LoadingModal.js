import React from 'react'
import PropTypes from 'prop-types'

import { StyledDialogOverlay, ModalContent } from '../generic/Modal/Modal'
import LoadingIndicator from '../LoadingIndicator'

const LoadingModal = ({ isOpen }) => {
  return isOpen && (
    <StyledDialogOverlay>
      <ModalContent>
        <LoadingIndicator />
      </ModalContent>
    </StyledDialogOverlay>
  )
}

LoadingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

export default LoadingModal

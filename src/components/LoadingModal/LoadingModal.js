import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { StyledDialogOverlay, ModalContent } from '../generic/Modal/Modal'
import LoadingIndicator from '../LoadingIndicator'

const LoadingModal = ({ displayModalTimingSeconds = 1 }) => {
  const [displayModal, setDisplayModal] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayModal(true)
    }, displayModalTimingSeconds * 1000)

    return () => {
      clearTimeout(timeout)
    }
  })

  return (
    displayModal && (
      <StyledDialogOverlay>
        <ModalContent>
          <LoadingIndicator />
        </ModalContent>
      </StyledDialogOverlay>
    )
  )
}

LoadingModal.propTypes = {
  displayModalTimingSeconds: PropTypes.number,
}

export default LoadingModal

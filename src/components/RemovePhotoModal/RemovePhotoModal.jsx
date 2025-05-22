import PropTypes from 'prop-types'
import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import LoadingModal from '../LoadingModal/LoadingModal'

const RemovePhotoModal = ({ isOpen, isLoading, onDismiss, modalText, removePhoto }) => {
  const mainContent = <>{modalText.prompt}</>

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={removePhoto}>
        {modalText.yes}
      </ButtonCaution>
    </RightFooter>
  )

  return (
    <>
      <Modal
        title={modalText.title}
        isOpen={isOpen}
        onDismiss={onDismiss}
        mainContent={mainContent}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
    </>
  )
}

RemovePhotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  modalText: PropTypes.shape({
    prompt: PropTypes.node,
    no: PropTypes.node,
    yes: PropTypes.node,
    title: PropTypes.node,
  }).isRequired,
  removePhoto: PropTypes.func.isRequired,
}

export default RemovePhotoModal

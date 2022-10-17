import PropTypes from 'prop-types'
import React from 'react'
import { ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import language from '../../language'

const DeleteConfirmModal = ({ isOpen, onDismiss }) => {
  const modalContent = (
    <>
      <p>{language.deleteSiteRecord.confirmDeleteText1}</p>
      <p>{language.deleteSiteRecord.confirmDeleteText2}</p>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        title={language.deleteSiteRecord.title}
        isOpen={isOpen}
        onDismiss={onDismiss}
        mainContent={modalContent}
        footerContent={footerContent}
      />
    </>
  )
}

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default DeleteConfirmModal

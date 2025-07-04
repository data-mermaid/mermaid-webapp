import React from 'react'
import PropTypes from 'prop-types'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import Modal, { RightFooter } from '../generic/Modal'

const NewUserModal = ({ isOpen, onDismiss, newUser, onSubmit, isLoading }) => {
  const modalContent = (
    <p>
      <strong>{newUser}</strong> {language.pages.userTable.newUserModalText}
    </p>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={onSubmit} disabled={isLoading}>
        Send email
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.pages.userTable.newUserModalTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

NewUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  newUser: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default NewUserModal

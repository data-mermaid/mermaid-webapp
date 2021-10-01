import React from 'react'
import PropTypes from 'prop-types'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const NewUserModal = ({ isOpen, onDismiss, newUser, onSubmit }) => {
  const modalBodyText = `{ ${newUser} } ${language.pages.userTable.newUserModalText}`
  const modalContent = <div>{modalBodyText}</div>

  const handleOnSubmit = () => {
    onSubmit().then(() => {
      onDismiss()
    })
  }

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit}>Send email</ButtonPrimary>
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
}

export default NewUserModal

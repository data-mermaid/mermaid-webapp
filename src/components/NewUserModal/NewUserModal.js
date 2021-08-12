import { toast } from 'react-toastify'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow, HelperText } from '../generic/form'
import language from '../../language'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const NewUserModal = ({ isOpen, onDismiss, newUser }) => {
  const modalBodyText = `{ ${newUser} } ${language.pages.userTable.newUserText}`
  const modalContent = <div>{modalBodyText}</div>

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={onDismiss}>
        <IconSend />
        Send email
      </ButtonPrimary>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
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
  newUser: PropTypes.string.isRequired,
}

export default NewUserModal

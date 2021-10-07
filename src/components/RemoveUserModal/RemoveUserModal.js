import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import { IconArrowRight } from '../icons'
import { Select } from '../generic/form'
import { Column } from '../generic/positioning'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const RemoveUserModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  userNameToBeRemoved,
  projectName,
}) => {
  const modalContent = (
    <div>
      Are you sure you want to remove {userNameToBeRemoved} from {projectName}?
    </div>
  )

  const handleOnSubmit = () => {
    onSubmit().then(() => {
      onDismiss()
    })
  }

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonCaution onClick={handleOnSubmit}>Remove User</ButtonCaution>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Remove User"
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

RemoveUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userNameToBeRemoved: PropTypes.string,
  projectName: PropTypes.string.isRequired,
}

RemoveUserModal.defaultProps = {
  userNameToBeRemoved: 'user',
}

export default RemoveUserModal

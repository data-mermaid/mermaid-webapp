import React from 'react'
import PropTypes from 'prop-types'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import { ButtonSecondary, ButtonCaution } from '../../../generic/buttons'
import language from '../../../../language'

const DeleteRecordConfirm = ({ isOpen, onDismiss, onConfirm }) => {
  return (
    <Modal
      title={language.prompt.deleteCollectRecordTitle}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={language.prompt.deleteCollectRecordPrompt}
      footerContent={
        <RightFooter>
          <ButtonSecondary onClick={onDismiss}>
            {language.prompt.no}
          </ButtonSecondary>
          <ButtonCaution onClick={onConfirm}>
            {language.prompt.yes}
          </ButtonCaution>
        </RightFooter>
      }
    />
  )
}

DeleteRecordConfirm.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default DeleteRecordConfirm

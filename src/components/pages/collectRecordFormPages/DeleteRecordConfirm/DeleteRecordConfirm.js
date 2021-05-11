import React from 'react'
import PropTypes from 'prop-types'
import Modal, {
  ModalRightAlignedButtonSpacing,
} from '../../../generic/Modal/Modal'
import { ButtonSecondary } from '../../../generic/buttons'
import language from '../../../../language'

const DeleteRecordConfirm = ({ isOpen, onDismiss, onConfirm }) => {
  return (
    <Modal
      title={language.prompt.deleteCollectRecordTitle}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={language.prompt.deleteCollectRecordPrompt}
      bottomRowContent={
        <ModalRightAlignedButtonSpacing>
          <ButtonSecondary onClick={onConfirm}>
            {language.prompt.yes}
          </ButtonSecondary>
          <ButtonSecondary onClick={onDismiss}>
            {language.prompt.no}
          </ButtonSecondary>
        </ModalRightAlignedButtonSpacing>
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

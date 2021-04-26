import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../generic/Modal/Modal'
import { ButtonSecondary } from '../../../generic/buttons'
import language from '../../../../language'

const DeleteRecordConfirm = ({ isOpen, onDismiss, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {language.prompt.deleteCollectRecord}
      <ButtonSecondary onClick={onConfirm}>
        {language.prompt.yes}
      </ButtonSecondary>
      <ButtonSecondary onClick={onDismiss}>
        {language.prompt.no}
      </ButtonSecondary>
    </Modal>
  )
}

DeleteRecordConfirm.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default DeleteRecordConfirm

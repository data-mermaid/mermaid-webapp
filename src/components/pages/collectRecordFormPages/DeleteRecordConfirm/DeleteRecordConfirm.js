import React from 'react'
import PropTypes from 'prop-types'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import { ButtonSecondary, ButtonCaution } from '../../../generic/buttons'
import language from '../../../../language'

const DeleteRecordConfirm = ({ isOpen, onDismiss, onConfirm }) => {
  return (
    <Modal
      title={language.deleteCollectRecord.title}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={language.deleteCollectRecord.prompt}
      footerContent={
        <RightFooter>
          <ButtonSecondary onClick={onDismiss}>
            {language.deleteCollectRecord.no}
          </ButtonSecondary>
          <ButtonCaution onClick={onConfirm}>
            {language.deleteCollectRecord.yes}
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

import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { DeleteRecordButtonCautionWrapper } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'

const DeleteRecordButton = ({ isNewRecord, deleteRecord, modalText }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const showDeleteConfirmPrompt = () => {
    setShowDeleteModal(true)
  }
  const closeDeleteConfirmPrompt = () => {
    setShowDeleteModal(false)
  }

  const handleDeleteRecord = () => {
    deleteRecord().then(() => {
      closeDeleteConfirmPrompt()
    })
  }

  return (
    <>
      <DeleteRecordButtonCautionWrapper>
        <ButtonCaution onClick={showDeleteConfirmPrompt} disabled={isNewRecord}>
          {modalText.title}
        </ButtonCaution>
      </DeleteRecordButtonCautionWrapper>
      <Modal
        title={modalText.title}
        isOpen={showDeleteModal}
        onDismiss={closeDeleteConfirmPrompt}
        mainContent={modalText.prompt}
        footerContent={
          <RightFooter>
            <ButtonSecondary onClick={closeDeleteConfirmPrompt}>{modalText.no}</ButtonSecondary>
            <ButtonCaution onClick={handleDeleteRecord}>{modalText.yes}</ButtonCaution>
          </RightFooter>
        }
      />
    </>
  )
}

DeleteRecordButton.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  modalText: PropTypes.shape({
    title: PropTypes.string,
    prompt: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
  }).isRequired,
}

export default DeleteRecordButton

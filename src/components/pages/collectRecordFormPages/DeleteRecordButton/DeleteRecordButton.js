import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import language from '../../../../language'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import { DeleteRecordButtonCautionWrapper } from '../CollectingFormPage.Styles'

const DeleteRecordButton = ({ isNewRecord, deleteRecord }) => {
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
          Delete Record
        </ButtonCaution>
      </DeleteRecordButtonCautionWrapper>
      <Modal
        title={language.deleteCollectRecord.title}
        isOpen={showDeleteModal}
        onDismiss={closeDeleteConfirmPrompt}
        mainContent={language.deleteCollectRecord.prompt}
        footerContent={
          <RightFooter>
            <ButtonSecondary onClick={closeDeleteConfirmPrompt}>
              {language.deleteCollectRecord.no}
            </ButtonSecondary>
            <ButtonCaution onClick={handleDeleteRecord}>{language.deleteCollectRecord.yes}</ButtonCaution>
          </RightFooter>
        }
      />
    </>
  )
}

DeleteRecordButton.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  deleteRecord: PropTypes.func.isRequired,
}

export default DeleteRecordButton

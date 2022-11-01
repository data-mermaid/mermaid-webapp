import PropTypes from 'prop-types'
import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { DeleteRecordButtonCautionWrapper } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'

const DeleteRecordButton = ({
  isNewRecord,
  deleteRecord,
  modalText,
  isOpen,
  onDismiss,
  openModal,
  errorData,
  currentPage,
  isLoading,
}) => {
  const mainContentPageTwo = (
    <>
      <p>{modalText.confirmDeleteText1}</p>
      <ul>
        {errorData.map((error) => (
          <li key={error.id}>{error.label}</li>
        ))}
      </ul>
      <p>{modalText.confirmDeleteText2}</p>
    </>
  )

  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution onClick={deleteRecord}>{modalText.yes}</ButtonCaution>
    </RightFooter>
  )

  const footerContentPageTwo = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  const mainContent = (
    <>
      {currentPage === 1 && modalText.prompt}
      {currentPage === 2 && mainContentPageTwo}
    </>
  )

  const footerContent = (
    <>
      {currentPage === 1 && footerContentPageOne}
      {currentPage === 2 && footerContentPageTwo}
    </>
  )

  return (
    <>
      <DeleteRecordButtonCautionWrapper>
        <ButtonCaution onClick={openModal} disabled={isNewRecord}>
          {modalText.title}
        </ButtonCaution>
      </DeleteRecordButtonCautionWrapper>
      <Modal
        title={modalText.title}
        isOpen={isOpen}
        onDismiss={onDismiss}
        mainContent={mainContent}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
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
    confirmDeleteText1: PropTypes.string,
    confirmDeleteText2: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  errorData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      site: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  currentPage: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
}

DeleteRecordButton.defaultProps = {
  errorData: [],
  currentPage: 1,
}

export default DeleteRecordButton

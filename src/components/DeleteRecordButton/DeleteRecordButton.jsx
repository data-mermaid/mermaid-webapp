import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { DeleteRecordButtonCautionWrapper } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

const DeleteRecordButton = ({
  currentPage = 1,
  errorData = [],
  isLoading,
  isNewRecord,
  isOpen,
  modalText,
  deleteRecord,
  onDismiss,
  openModal,
}) => {
  const currentProjectPath = useCurrentProjectPath()
  const gtmId = modalText.title === 'Delete Record' ? 'gtm-delete-record' : 'gtm-delete'

  const mainContentPageTwo = (
    <>
      <p>{modalText.confirmDeleteText1}</p>
      <ul>
        {errorData.map((error) => (
          <li key={error.id}>
            <Link to={`${currentProjectPath}/submitted/${error.protocol}/${error.id}`}>
              {error.sampleUnitLabel}
            </Link>
          </li>
        ))}
      </ul>
      <p>{modalText.confirmDeleteText2}</p>
    </>
  )

  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={deleteRecord}>
        {modalText.yes}
      </ButtonCaution>
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
        <ButtonCaution id={gtmId} onClick={openModal} disabled={isNewRecord}>
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
  currentPage: PropTypes.number,
  errorData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      site: PropTypes.string,
      sampleUnitLabel: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  isNewRecord: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalText: PropTypes.shape({
    title: PropTypes.string,
    prompt: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
    confirmDeleteText1: PropTypes.string,
    confirmDeleteText2: PropTypes.string,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

export default DeleteRecordButton

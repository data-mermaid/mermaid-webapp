import PropTypes from 'prop-types'
import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import { DeleteRecordButtonCautionWrapper } from '../CollectingFormPage.Styles'
import LoadingModal from '../../../LoadingModal/LoadingModal'

const ClearSizeValuesModal = ({
  currentPage,
  isLoading,
  isOpen,
  modalText,
  clearSizeValues,
  onDismiss,
  openModal,
}) => {
  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={clearSizeValues}>
        {modalText.yes}
      </ButtonCaution>
    </RightFooter>
  )

  const footerContentPageTwo = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  const mainContent = <>{currentPage === 1 && modalText.prompt}</>

  const footerContent = (
    <>
      {currentPage === 1 && footerContentPageOne}
      {currentPage === 2 && footerContentPageTwo}
    </>
  )

  return (
    <>
      <DeleteRecordButtonCautionWrapper>
        <ButtonCaution onClick={openModal}>{modalText.title}</ButtonCaution>
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

ClearSizeValuesModal.propTypes = {
  currentPage: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalText: PropTypes.shape({
    title: PropTypes.string,
    prompt: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
  }).isRequired,
  clearSizeValues: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

ClearSizeValuesModal.defaultProps = {
  currentPage: 1,
}

export default ClearSizeValuesModal

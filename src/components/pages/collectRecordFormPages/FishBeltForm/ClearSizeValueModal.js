import PropTypes from 'prop-types'
import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'
import LoadingModal from '../../../LoadingModal/LoadingModal'

const ClearSizeValuesModal = ({ isLoading, isOpen, modalText, clearSizeValues, onDismiss }) => {
  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={clearSizeValues}>
        {modalText.yes}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = <>{modalText.prompt}</>

  return (
    <>
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
}

export default ClearSizeValuesModal

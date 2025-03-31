import PropTypes from 'prop-types'
import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import Modal, { RightFooter } from '../../../generic/Modal/Modal'

const ClearSizeValuesModal = ({ isOpen, modalText, handleResetSizeValues, onDismiss }) => {
  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution onClick={handleResetSizeValues}>{modalText.yes}</ButtonCaution>
    </RightFooter>
  )

  const mainContent = <>{modalText.prompt}</>

  return (
    <Modal
      title={modalText.title}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={mainContent}
      footerContent={footerContent}
    />
  )
}

ClearSizeValuesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalText: PropTypes.shape({
    title: PropTypes.string,
    prompt: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
  }).isRequired,
  handleResetSizeValues: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ClearSizeValuesModal

import React from 'react'
import PropTypes from 'prop-types'

import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { getObserverNameToUse } from '../../library/observerHelpers'
import { observerPropType } from '../../App/mermaidData/mermaidDataProptypes'

const modalLanguage = language.pages.collectRecord.removeObserverModal

const RemoveObserverModal = ({ isOpen, onDismiss, observer = undefined, onSubmit }) => {
  const observerNameToUse = observer ? getObserverNameToUse(observer) : ''

  const footerContent = (
    <RightFooter>
      <ButtonSecondary type="button" onClick={onDismiss}>
        {modalLanguage.removeObserverCancelButton}
      </ButtonSecondary>
      <ButtonCaution type="button" onClick={onSubmit}>
        {modalLanguage.removeObserverSubmitButton}
      </ButtonCaution>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={modalLanguage.title}
      mainContent={modalLanguage.getModalContent(observerNameToUse)}
      footerContent={footerContent}
    />
  )
}

RemoveObserverModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  observer: observerPropType,
}

export default RemoveObserverModal

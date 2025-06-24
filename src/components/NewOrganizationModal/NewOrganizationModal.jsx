import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow, HelperText } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal.tsx'

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  display: block;
  border: none;
`
const NewOrganizationModal = ({ isOpen, onDismiss, onSubmit, initialValue = '' }) => {
  const [newOrganizationSuggestion, setNewOrganizationSuggestion] = useState(initialValue)
  const isSubmitButtonDisabled = newOrganizationSuggestion === ''
  useEffect(
    function useOrganizationSelectSearchTextAsInitialValue() {
      if (initialValue) {
        setNewOrganizationSuggestion(initialValue)
      }
    },
    [initialValue],
  )

  const resetAndCloseModal = () => {
    setNewOrganizationSuggestion('')
    onDismiss()
  }

  const handleOnSubmit = () => {
    onSubmit(newOrganizationSuggestion)
    resetAndCloseModal()
    toast.success(...getToastArguments(language.success.newOrganizationAdd))
  }

  const helperText = language.pages.projectInfo.suggestionOrganizationHelperText
  const modalContent = (
    <>
      <ModalInputRow>
        <label id="modal-input-for-org-label" htmlFor="modal-input-for-org">
          New Organization Name
        </label>
        <div>
          <Input
            aria-labelledby="modal-input-for-org-label"
            aria-describedby="modal-input-for-org-descp"
            id="modal-input-for-org"
            value={newOrganizationSuggestion}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
            onChange={(event) => setNewOrganizationSuggestion(event.target.value)}
          />
          {helperText && <HelperText id="modal-input-for-org-descp">{helperText}</HelperText>}
        </div>
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={resetAndCloseModal}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit} disabled={isSubmitButtonDisabled}>
        <IconSend />
        Send to MERMAID for review
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={language.pages.projectInfo.createOrganizationTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

NewOrganizationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
}

export default NewOrganizationModal

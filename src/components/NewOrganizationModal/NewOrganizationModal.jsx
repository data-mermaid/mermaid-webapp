import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow, HelperText } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal'

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  display: block;
  border: none;
`
const NewOrganizationModal = ({ isOpen, onDismiss, onSubmit, initialValue = '' }) => {
  const { t } = useTranslation()
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

  const helperText = t('organizations.approved_and_added_to_project')
  const modalContent = (
    <>
      <ModalInputRow>
        <label id="modal-input-for-org-label" htmlFor="modal-input-for-org">
          {t('organizations.new_organization_name')}
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
      <ButtonSecondary onClick={resetAndCloseModal}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit} disabled={isSubmitButtonDisabled}>
        <IconSend />
        {t('buttons.suggestion_review_request')}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={t('organizations.suggest_new')}
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

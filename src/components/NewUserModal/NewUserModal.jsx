import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'

const NewUserModal = ({ isOpen, onDismiss, newUser, onSubmit, isLoading }) => {
  const { t } = useTranslation()

  const modalContent = (
    <p>
      <strong>{newUser}</strong> {t('user_table.new_user_modal_text')}
    </p>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonPrimary onClick={onSubmit} disabled={isLoading}>
        {t('buttons.send_email')}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('user_table.new_user_modal_title')}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

NewUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  newUser: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default NewUserModal

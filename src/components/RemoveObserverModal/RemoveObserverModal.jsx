import React from 'react'
import PropTypes from 'prop-types'

import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'
import { getObserverNameToUse } from '../../library/observerHelpers'
import { observerPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useTranslation } from 'react-i18next'

const RemoveObserverModal = ({ isOpen, onDismiss, observer = undefined, onSubmit }) => {
  const { t } = useTranslation()
  const observerNameToUse = observer ? getObserverNameToUse(observer) : ''

  const footerContent = (
    <RightFooter>
      <ButtonSecondary type="button" onClick={onDismiss}>
        {t('button.cancel')}
      </ButtonSecondary>
      <ButtonCaution type="button" onClick={onSubmit}>
        {t('remove_user')}
      </ButtonCaution>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('remove_observer_from_record')}
      mainContent={<>{t('remove_user_confirmation', { userName: observerNameToUse })}</>}
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

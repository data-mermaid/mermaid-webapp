import React from 'react'
import { ButtonCaution, ButtonSecondary } from '../../../generic/buttons'
import Modal, { RightFooter } from '../../../generic/Modal'
import { useTranslation } from 'react-i18next'

interface ClearSizeValuesModalProps {
  isOpen: boolean
  handleResetSizeValues: () => void
  onDismiss: () => void
}

const ClearSizeValuesModal = ({
  isOpen,
  handleResetSizeValues,
  onDismiss,
}: ClearSizeValuesModalProps) => {
  const { t } = useTranslation()

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution onClick={handleResetSizeValues}>{t('clear_size_values')}</ButtonCaution>
    </RightFooter>
  )

  const mainContent = <>{t('clear_size_confirmation')}</>

  return (
    <Modal
      title={t('clear_size_values')}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={mainContent}
      footerContent={footerContent}
    />
  )
}

export default ClearSizeValuesModal

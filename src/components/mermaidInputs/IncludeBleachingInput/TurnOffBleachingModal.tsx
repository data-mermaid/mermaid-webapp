import React from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonCaution, ButtonSecondary } from '../../generic/buttons'
import Modal, { RightFooter } from '../../generic/Modal'

interface TurnOffBleachingModalProps {
  lostStatusCount: number
  isOpen: boolean
  onConfirm: () => void
  onDismiss: () => void
}

const TurnOffBleachingModal = ({
  lostStatusCount,
  isOpen,
  onConfirm,
  onDismiss,
}: TurnOffBleachingModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      title={t('observations.turn_off_bleaching_title')}
      testId="turn-off-bleaching-modal"
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={t('observations.turn_off_bleaching_body', { count: lostStatusCount })}
      footerContent={
        <RightFooter>
          <ButtonSecondary type="button" onClick={onDismiss}>
            {t('buttons.cancel')}
          </ButtonSecondary>
          <ButtonCaution type="button" onClick={onConfirm} data-testid="turn-off-bleaching-confirm">
            {t('observations.turn_off_bleaching_confirm')}
          </ButtonCaution>
        </RightFooter>
      }
    />
  )
}

export default TurnOffBleachingModal

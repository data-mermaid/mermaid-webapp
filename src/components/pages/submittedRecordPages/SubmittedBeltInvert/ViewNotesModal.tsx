import React from 'react'
import { useTranslation } from 'react-i18next'
import Modal, { RightFooter } from '../../../generic/Modal'
import { ButtonPrimary } from '../../../generic/buttons'
import styles from './ViewNotesModal.module.scss'

interface ViewNotesModalProps {
  isOpen: boolean
  notes: string
  invertAttributeName?: string
  onDismiss: () => void
}

const ViewNotesModal = ({ isOpen, notes, invertAttributeName, onDismiss }: ViewNotesModalProps) => {
  const { t } = useTranslation()

  const subheading = invertAttributeName ? (
    <p className={styles.notesSubheading}>
      <strong>{t('observations.macroinvertebrate_name')}:</strong> {invertAttributeName}
    </p>
  ) : null

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('notes')}
      maxWidth="72rem"
      mainContent={
        <>
          {subheading}
          <pre className={styles.notesTextContainer}>{notes}</pre>
        </>
      }
      footerContent={
        <RightFooter>
          <ButtonPrimary type="button" onClick={onDismiss} data-testid="notes-done-button">
            {t('buttons.done')}
          </ButtonPrimary>
        </RightFooter>
      }
    />
  )
}

export default ViewNotesModal

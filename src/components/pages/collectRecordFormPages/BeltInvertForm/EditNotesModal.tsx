import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal, { RightFooter } from '../../../generic/Modal'
import { ButtonPrimary } from '../../../generic/buttons'
import styles from './EditNotesModal.module.scss'

export interface EditNotesModalProps {
  isOpen: boolean
  rowNumber: number
  invertAttributeName: string | undefined
  currentNote: string
  onDismiss: () => void
  onDone: (newNote: string) => void
}

const EditNotesModal = ({
  isOpen,
  rowNumber,
  invertAttributeName,
  currentNote,
  onDismiss,
  onDone,
}: EditNotesModalProps) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(currentNote)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      setDraft(currentNote)
    }
  }, [isOpen, currentNote])

  useEffect(() => {
    // Focuses the text area and moves the cursor to the end of the textarea when modal is opened
    if (isOpen && textareaRef.current) {
      const el = textareaRef.current
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [isOpen])

  const subheading = invertAttributeName ? (
    <p className={styles.notesSubheading}>
      <strong>{t('macroinvertebrate_observations.macroinvertebrate_name')}:</strong>{' '}
      {invertAttributeName}
    </p>
  ) : (
    <p className={styles.notesSubheading}>
      <strong>{t('macroinvertebrate_observations.row')}:</strong> {rowNumber}
    </p>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('macroinvertebrate_observations.edit_notes')}
      mainContent={
        <>
          {subheading}
          <textarea
            ref={textareaRef}
            className={styles.notesTextarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            data-testid="notes-textarea"
            aria-label={t('notes')}
          />
        </>
      }
      footerContent={
        <RightFooter>
          <ButtonPrimary
            type="button"
            data-testid="notes-done-button"
            onClick={() => onDone(draft)}
          >
            {t('macroinvertebrate_observations.done')}
          </ButtonPrimary>
        </RightFooter>
      }
    />
  )
}

export default EditNotesModal

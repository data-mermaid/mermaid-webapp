import React from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'
import { WarningText } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'
import buttonStyles from '../../style/buttons.module.scss'

interface DeleteProjectButtonProps {
  isLoading: boolean
  isOpen: boolean
  isDemoProject: boolean
  hasSampleUnits: boolean
  hasOtherUsers: boolean
  deleteProject: () => void
  onDismiss: () => void
  openModal: () => void
  projectName: string
}

const DeleteProjectButton = ({
  isLoading,
  isDemoProject = false,
  hasSampleUnits,
  hasOtherUsers,
  isOpen,
  projectName,
  deleteProject,
  onDismiss,
  openModal,
}: DeleteProjectButtonProps) => {
  const { t } = useTranslation()
  const resolvedProjectName = projectName || t('projects.project')

  return isDemoProject ? (
    <>
      <button
        className={buttonStyles['button--caution']}
        type="button"
        onClick={deleteProject}
        disabled={isLoading}
      >
        {t('projects.buttons.delete_demo')}
      </button>
      <p>{t('projects.demo.delete_notice')}</p>
    </>
  ) : (
    <>
      <div className={buttonStyles['button--caution__wrapper']}>
        <button
          className={buttonStyles['button--caution']}
          type="button"
          onClick={openModal}
          disabled={hasSampleUnits || hasOtherUsers}
        >
          {t('projects.buttons.delete')}
        </button>
      </div>
      {hasSampleUnits && <WarningText>{t('projects.delete_sample_units_notice')}</WarningText>}
      {hasOtherUsers && <WarningText>{t('projects.delete_other_users_notice')}</WarningText>}
      {isOpen && (
        <Modal
          title={t('projects.buttons.delete')}
          isOpen
          onDismiss={onDismiss}
          mainContent={
            <p>{t('projects.user_confirm_delete', { projectName: resolvedProjectName })}</p>
          }
          footerContent={
            <RightFooter>
              <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
              <button
                className={buttonStyles['button--caution']}
                type="button"
                disabled={isLoading}
                onClick={deleteProject}
              >
                {t('projects.confirm_delete', { projectName: resolvedProjectName })}
              </button>
            </RightFooter>
          }
        />
      )}
      {isLoading && <LoadingModal />}
    </>
  )
}

export default DeleteProjectButton

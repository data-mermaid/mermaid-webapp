import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'
import { WarningText } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import buttonStyles from '../../style/buttons.module.scss'

interface ErrorDataProps {
  id: string | number
  protocol: string
  site: string
  sampleUnitLabel: string
}

interface DeleteProjectButtonProps {
  currentPage: number
  isLoading: boolean
  isOpen: boolean
  isDemoProject: boolean
  errorData?: ErrorDataProps[]
  hasSampleUnits: boolean
  hasOtherUsers: boolean
  deleteProject: () => void
  onDismiss: () => void
  openModal: () => void
  projectName: string
}

const DeleteProjectButton = ({
  currentPage = 1,
  errorData = [],
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

  const currentProjectPath = useCurrentProjectPath()

  const mainContentPageTwo = (
    <>
      <p>
        {t('projects.cannot_delete', {
          projectName: resolvedProjectName,
        })}
      </p>
      <ul>
        {errorData.map((error) => (
          <li key={error.id}>
            <Link to={`${currentProjectPath}/submitted/${error.protocol}/${error.id}`}>
              {error.sampleUnitLabel}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        {t('projects.remove_before_delete', {
          projectName: resolvedProjectName,
        })}
      </p>
    </>
  )

  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <button
        className={buttonStyles['button--caution']}
        disabled={isLoading}
        onClick={deleteProject}
      >
        {t('projects.confirm_delete', { projectName: resolvedProjectName })}
      </button>
    </RightFooter>
  )

  const footerContentPageTwo = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.close')}</ButtonSecondary>
    </RightFooter>
  )

  return isDemoProject ? (
    <button className={buttonStyles['button--caution']} type="button" onClick={deleteProject}>
      {t('projects.buttons.delete')}
    </button>
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
            <>
              {currentPage === 1 &&
                t('projects.user_confirm_delete', { projectName: resolvedProjectName })}
              {currentPage === 2 && mainContentPageTwo}
            </>
          }
          footerContent={
            <>
              {currentPage === 1 && footerContentPageOne}
              {currentPage === 2 && footerContentPageTwo}
            </>
          }
        />
      )}
      {isLoading && <LoadingModal />}
    </>
  )
}

export default DeleteProjectButton

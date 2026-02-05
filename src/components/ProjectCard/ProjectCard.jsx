import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  CheckBoxLabel,
  ProjectCardHeader,
  ProjectCardHeaderButtonsAndDate,
} from './ProjectCard.styles'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import { getToastArguments } from '../../library/getToastArguments'
import stopEventPropagation from '../../library/stopEventPropagation'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { IconCopy } from '../icons'
import { ButtonSecondary } from '../generic/buttons'
import { removeTimeZoneFromDate } from '../../library/removeTimeZoneFromDate'
import ProjectCardSummary from './ProjectCardSummary'
import ProjectModal from './ProjectModal'
import {
  getIsUserAdminForProject,
  getIsUserReadOnlyForProject,
} from '../../App/currentUserProfileHelpers'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useTranslation } from 'react-i18next'
import labelStyles from '../../style/labels.module.scss'
import styles from './ProjectCard.module.scss'

const OFFLINE_READY_TOAST_ID = 'offline-ready-toast'

const ProjectCard = ({ project, isOfflineReady, addProjectToProjectsPage, ...restOfProps }) => {
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { name, countries, updated_on, id } = project
  const { setIsSyncInProgress } = useSyncStatus()
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, id)
  const navigate = useNavigate()
  const projectUrl = `/projects/${id}`
  const { t } = useTranslation()
  const isDisabled = !isAppOnline && isReadOnlyUser
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isAdminUser = getIsUserAdminForProject(currentUser, id)
  const isDemoProject = project.is_demo

  const handleProjectOfflineReadyClick = (event) => {
    const isChecked = event.target.checked

    if (isChecked) {
      setIsSyncInProgress(true)
      databaseSwitchboardInstance
        .setProjectAsOfflineReady(project.id)
        .then(() => {
          // we need to clear the sync status even if component no longer mounted
          setIsSyncInProgress(false)
          toast.success(
            ...getToastArguments(
              t('projects.success.offline_ready_on', { projectName: name }),
              OFFLINE_READY_TOAST_ID,
            ),
          )
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(
                  t('projects.errors.offline_ready_on_failed', { projectName: name }),
                  OFFLINE_READY_TOAST_ID,
                ),
              )
            },
          })
        })
    }
    if (!isChecked) {
      setIsSyncInProgress(true)
      databaseSwitchboardInstance
        .unsetProjectAsOfflineReady(project.id)
        .then(() => {
          // we need to clear the sync status even if component no longer mounted
          setIsSyncInProgress(false)
          toast.success(
            ...getToastArguments(
              t('projects.success.offline_ready_off', { projectName: name }),
              OFFLINE_READY_TOAST_ID,
            ),
          )
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(
                  t('projects.errors.offline_ready_removal_failure', { projectName: name }),
                  OFFLINE_READY_TOAST_ID,
                ),
              )
            },
          })
        })
    }
  }

  const handleCardClick = () => {
    if (isReadOnlyUser && !isAppOnline) {
      return
    }

    const destinationUrl = isAppOnline
      ? `${projectUrl}/observers-and-transects`
      : `${projectUrl}/collecting`

    navigate(destinationUrl)
  }

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) {
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  return (
    <div
      {...restOfProps}
      className={styles['project-card__wrapper']}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={name}
      aria-disabled={isDisabled}
      data-testid="project-card"
    >
      <ProjectCardHeader>
        <div>
          <div className={styles['project-card__header']}>
            <h2>{name}</h2>
            <div className={styles['pill-container']}>
              {isAdminUser && (
                <div className={[labelStyles.pill, labelStyles.pill__admin].join(' ')}>
                  {t('users.roles.admin')}
                </div>
              )}
              {isDemoProject && (
                <div className={[labelStyles.pill, labelStyles.pill__demo].join(' ')}>
                  {t('projects.demo.demo')}
                </div>
              )}
            </div>
          </div>
          <span className={styles['date-country-label']}>{countries.join(', ')}</span>
        </div>
        <ProjectCardHeaderButtonsAndDate onClick={stopEventPropagation}>
          <div className={styles['no-wrap-wrapper']}>
            <ButtonSecondary
              onClick={() => setIsProjectModalOpen(true)}
              aria-label={t('buttons.copy')}
              disabled={!isAppOnline || isDemoProject}
              data-testid="copy-project-button"
            >
              <IconCopy />
              <span>{t('buttons.copy')}</span>
            </ButtonSecondary>

            {isProjectModalOpen && (
              <ProjectModal
                isOpen
                onDismiss={() => setIsProjectModalOpen(false)}
                project={project}
                addProjectToProjectsPage={addProjectToProjectsPage}
              />
            )}
            <CheckBoxLabel
              htmlFor={project.id}
              onClick={stopEventPropagation}
              disabled={!isAppOnline}
            >
              <input
                id={project.id}
                type="checkbox"
                checked={isOfflineReady}
                onChange={handleProjectOfflineReadyClick}
                disabled={!isAppOnline}
                data-testid="offline-ready"
              />
              {t('projects.available_offline')}
            </CheckBoxLabel>
          </div>
          <span className={styles['date-country-label']} style={{ marginTop: '1rem' }}>
            {removeTimeZoneFromDate(updated_on)}
          </span>
        </ProjectCardHeaderButtonsAndDate>
      </ProjectCardHeader>
      <ProjectCardSummary project={project} isAppOnline={isAppOnline} />
    </div>
  )
}

ProjectCard.propTypes = {
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
  addProjectToProjectsPage: PropTypes.func.isRequired,
}

export default ProjectCard

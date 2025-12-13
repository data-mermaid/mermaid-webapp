import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import {
  AdminPill,
  CardWrapper,
  CheckBoxLabel,
  ProjectCardHeader,
  DateAndCountryLabel,
  ProjectCardHeaderButtonsAndDate,
  ProjectCardHeaderButtonWrapper,
  ProjectTitleContainer,
} from './ProjectCard.styles'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import stopEventPropagation from '../../library/stopEventPropagation'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { IconCopy } from '../icons'
import { ButtonSecondary } from '../generic/buttons'
import { removeTimeZoneFromDate } from '../../library/removeTimeZoneFromDate'
import ProjectCardSummary from './ProjectCardSummary'
import ProjectModal from './ProjectModal'
import {
  getIsUserReadOnlyForProject,
  getIsUserAdminForProject,
} from '../../App/currentUserProfileHelpers'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useTranslation } from 'react-i18next'

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

  const handleHttpResponseError = useHttpResponseErrorHandler()

  const isAdminUser = getIsUserAdminForProject(currentUser, id)

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
            ...getToastArguments(language.success.getProjectTurnOnOfflineReadySuccess(name)),
          )
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(language.error.getProjectTurnOnOfflineReadyFailure(name)),
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
            ...getToastArguments(language.success.getProjectTurnOffOfflineReadySuccess(name)),
          )
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(
                ...getToastArguments(language.error.getProjectTurnOffOfflineReadyFailure(name)),
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

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  return (
    <CardWrapper
      onClick={handleCardClick}
      {...restOfProps}
      disabled={isReadOnlyUser && !isAppOnline}
      data-testid="project-card"
    >
      <ProjectCardHeader>
        <div>
          <ProjectTitleContainer>
            <h2>{name}</h2>
            {isAdminUser ? <AdminPill>admin</AdminPill> : null}
          </ProjectTitleContainer>
          <DateAndCountryLabel>{countries.join(', ')}</DateAndCountryLabel>
        </div>
        <ProjectCardHeaderButtonsAndDate onClick={stopEventPropagation}>
          <ProjectCardHeaderButtonWrapper>
            <ButtonSecondary
              onClick={() => setIsProjectModalOpen(true)}
              aria-label="Copy"
              disabled={!isAppOnline}
            >
              <IconCopy />
              <span>{t('buttons.copy')}</span>
            </ButtonSecondary>

            <ProjectModal
              isOpen={isProjectModalOpen}
              onDismiss={() => setIsProjectModalOpen(false)}
              project={project}
              addProjectToProjectsPage={addProjectToProjectsPage}
            />
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
              />
              {t('projects.available_offline')}
            </CheckBoxLabel>
          </ProjectCardHeaderButtonWrapper>
          <DateAndCountryLabel>{removeTimeZoneFromDate(updated_on)}</DateAndCountryLabel>
        </ProjectCardHeaderButtonsAndDate>
      </ProjectCardHeader>
      <ProjectCardSummary project={project} isAppOnline={isAppOnline} />
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
  addProjectToProjectsPage: PropTypes.func.isRequired,
}

export default ProjectCard

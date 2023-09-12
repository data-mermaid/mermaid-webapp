import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
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
import SyncApiDataIntoOfflineStorage from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
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

const ProjectCard = ({
  project,
  apiSyncInstance,
  isOfflineReady,
  addProjectToProjectsPage,
  ...restOfProps
}) => {
  const { isAppOnline } = useOnlineStatus()
  const { name, countries, updated_on, id } = project
  const { currentUser } = useCurrentUser()
  const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, id)
  const { setIsSyncInProgress } = useSyncStatus()
  const history = useHistory()
  const projectUrl = `projects/${id}`

  const handleHttpResponseError = useHttpResponseErrorHandler()

  const isAdminUser = getIsUserAdminForProject(currentUser, id)

  const handleProjectOfflineReadyClick = (event) => {
    const isChecked = event.target.checked

    if (isChecked) {
      setIsSyncInProgress(true)
      apiSyncInstance
        .pushThenPullAllProjectDataExceptChoices(project.id)
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
      apiSyncInstance
        .pushThenRemoveProjectFromOfflineStorage(project.id)
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

    history.push(destinationUrl)
  }

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  console.log({ name })

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
              <span>Copy</span>
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
              {language.pages.projectsList.offlineReadyCheckboxLabel}
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
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
  addProjectToProjectsPage: PropTypes.func.isRequired,
}

export default ProjectCard

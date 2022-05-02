import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import React, { useEffect, useState } from 'react'

import {
  ButtonGroups,
  CardWrapper,
  CheckBoxLabel,
  ProjectInfoWrapper,
  ProjectNameWrapper,
} from './ProjectCard.styles'
import { pluralize } from '../../library/pluralize'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import NavLinkButtonGroup from '../NavLinkButtonGroup'
import stopEventPropagation from '../../library/stopEventPropagation'
import SyncApiDataIntoOfflineStorage from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useCurrentUser } from '../../App/CurrentUserContext'

const LoadingButtonGroupIndicator = styled.div`
  padding: 1.5rem 1rem;
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

const ProjectCard = ({ project, apiSyncInstance, isOfflineReady, ...restOfProps }) => {
  const { isAppOnline } = useOnlineStatus()
  const { name, countries, num_sites, updated_on, id } = project
  const { setIsSyncInProgress } = useSyncStatus()
  const { projectUserRoles } = useCurrentUser()

  const isUserRoleEmpty = projectUserRoles && Object.keys(projectUserRoles).length === 0
  const currentProjectUserRole = projectUserRoles[id]
  const isReadOnlyUser =
    !isUserRoleEmpty && !(currentProjectUserRole.is_admin || currentProjectUserRole.is_collector)

  const history = useHistory()
  const projectUrl = `projects/${id}`

  const handleProjectOfflineReadyClick = (event) => {
    const isChecked = event.target.checked

    if (isChecked) {
      setIsSyncInProgress(true)
      apiSyncInstance
        .pushThenPullEverythingForAProjectButChoices(project.id)
        .then(() => {
          // we need to clear the sync status even if component no longer mounted
          setIsSyncInProgress(false)
          toast.success(
            ...getToastArguments(language.success.getProjectTurnOnOfflineReadySuccess(name)),
          )
        })
        .catch(() => {
          toast.error(
            ...getToastArguments(language.error.getProjectTurnOnOfflineReadyFailure(name)),
          )
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
        .catch(() => {
          toast.error(
            ...getToastArguments(language.error.getProjectTurnOffOfflineReadyFailure(name)),
          )
        })
    }
  }

  const handleCardClick = () => {
    // hiding for alpha release because leads nowhere useful
    // const destinationUrl = isAppOnline
    //   ? `${projectUrl}/health`
    //   : `${projectUrl}/collecting`

    // temp for alpha
    const readOnlyUserDestinationUrl = isAppOnline ? `${projectUrl}/data` : `${projectUrl}/sites`
    const destinationUrl = isReadOnlyUser ? readOnlyUserDestinationUrl : `${projectUrl}/collecting`

    history.push(destinationUrl)
  }
  //  hiding for alpha release because leads nowhere useful
  // const handleProjectCopyClick = (e) => {
  //   e.stopPropagation()
  // }

  return (
    <CardWrapper onClick={handleCardClick} {...restOfProps}>
      <ProjectNameWrapper>
        <h2>{name}</h2>
      </ProjectNameWrapper>
      <ProjectInfoWrapper>
        <p>{countries.join(', ')}</p>
        <p>
          <strong>{num_sites}</strong> {pluralize(num_sites, 'site', 'sites')}
        </p>
        <p>
          Updated: <strong>{new Date(updated_on).toString()}</strong>
        </p>
      </ProjectInfoWrapper>
      {isUserRoleEmpty ? (
        <LoadingButtonGroupIndicator aria-label="project card loading indicator">
          {language.loadingIndicator.loadingPrimary}
        </LoadingButtonGroupIndicator>
      ) : (
        <ButtonGroups data-testid="project-button-groups" isReadOnlyUser={isReadOnlyUser}>
          <NavLinkButtonGroup projectUrl={projectUrl} isReadOnlyUser={isReadOnlyUser} />
          {/* hiding for alpha release because leads nowhere useful */}
          {/* <OfflineHide>
          <VerticalRule />
          <ProjectCardButtonSecondary
            onClick={handleProjectCopyClick}
            aria-label="Copy"
          >
            <IconCopy />
            <span>Copy</span>
          </ProjectCardButtonSecondary>
        </OfflineHide> */}
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
        </ButtonGroups>
      )}
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
}

export default ProjectCard

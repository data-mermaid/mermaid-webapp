import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

import {
  ButtonGroups,
  CardWrapper,
  CheckBoxLabel,
  ProjectCardButtonSecondary,
  ProjectInfoWrapper,
  ProjectNameWrapper,
  VerticalRule,
} from './ProjectCard.styles'
import { IconCopy } from '../icons'
import { pluralize } from '../../library/pluralize'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import language from '../../language'
import NavLinkButtonGroup from '../NavLinkButtonGroup'
import OfflineHide from '../generic/OfflineHide'
import stopEventPropagation from '../../library/stopEventPropagation'
import SyncApiDataIntoOfflineStorage from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

const ProjectCard = ({
  project,
  apiSyncInstance,
  isOfflineReady,
  ...restOfProps
}) => {
  const { isOnline: isAppOnline } = useOnlineStatus()
  const { name, countries, num_sites, updated_on, id } = project
  const { setIsSyncInProgress } = useSyncStatus()
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
            language.success.getProjectTurnOnOfflineReadySuccess(name),
          )
        })
        .catch(() => {
          toast.error(language.error.getProjectTurnOnOfflineReadyFailure(name))
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
            language.success.getProjectTurnOffOfflineReadySuccess(name),
          )
        })
        .catch(() => {
          toast.error(language.error.getProjectTurnOffOfflineReadyFailure(name))
        })
    }
  }

  const handleCardClick = () => {
    const destinationUrl = isAppOnline
      ? `${projectUrl}/health`
      : `${projectUrl}/collecting`

    history.push(destinationUrl)
  }

  const handleProjectCopyClick = (e) => {
    e.stopPropagation()
  }

  return (
    <CardWrapper onClick={handleCardClick} {...restOfProps}>
      <ProjectNameWrapper>
        <h2>{name}</h2>
      </ProjectNameWrapper>
      <ProjectInfoWrapper>
        <p>{countries.join(', ')}</p>
        <p>
          {num_sites} {num_sites && pluralize(num_sites, 'site', 'sites')}
        </p>
        <CheckBoxLabel
          htmlFor="offline-toggle"
          onClick={stopEventPropagation}
          disabled={!isAppOnline}
        >
          <input
            id="offline-toggle"
            type="checkbox"
            checked={isOfflineReady}
            onChange={handleProjectOfflineReadyClick}
            disabled={!isAppOnline}
          />
          {language.pages.projectsList.offlineReadyCheckboxLabel}
        </CheckBoxLabel>
        <p>Updated: {updated_on}</p>
      </ProjectInfoWrapper>
      <ButtonGroups data-testid="project-button-groups">
        <NavLinkButtonGroup projectUrl={projectUrl} />
        <OfflineHide>
          <VerticalRule />
          <ProjectCardButtonSecondary
            onClick={handleProjectCopyClick}
            aria-label="Copy"
          >
            <IconCopy />
            <span>Copy</span>
          </ProjectCardButtonSecondary>
        </OfflineHide>
      </ButtonGroups>
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage)
    .isRequired,
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
}

export default ProjectCard

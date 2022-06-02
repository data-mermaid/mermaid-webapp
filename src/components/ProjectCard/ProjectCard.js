import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

import {
  ButtonGroups,
  CardWrapper,
  CheckBoxLabel,
  ProjectInfoWrapper,
  ProjectNameWrapper,
} from './ProjectCard.styles'
import { pluralize } from '../../library/strings/pluralize'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import NavLinkButtonGroup from '../NavLinkButtonGroup'
import stopEventPropagation from '../../library/stopEventPropagation'
import SyncApiDataIntoOfflineStorage from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { useSyncStatus } from '../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'

const ProjectCard = ({ project, apiSyncInstance, isOfflineReady, ...restOfProps }) => {
  const { isAppOnline } = useOnlineStatus()
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
    const destinationUrl = isAppOnline
      ? `${projectUrl}/usersandtransects`
      : `${projectUrl}/collecting`

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
      <ButtonGroups data-testid="project-button-groups">
        <NavLinkButtonGroup projectUrl={projectUrl} />
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
        <CheckBoxLabel htmlFor={project.id} onClick={stopEventPropagation} disabled={!isAppOnline}>
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
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  apiSyncInstance: PropTypes.instanceOf(SyncApiDataIntoOfflineStorage).isRequired,
  project: projectPropType.isRequired,
  isOfflineReady: PropTypes.bool.isRequired,
}

export default ProjectCard

import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

import {
  CardWrapper,
  CheckBoxLabel,
  ProjectCardHeader,
  DateAndCountryLabel,
  ProjectCardHeaderButtonsAndDate,
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

const ProjectCard = ({ project, apiSyncInstance, isOfflineReady, ...restOfProps }) => {
  const { isAppOnline } = useOnlineStatus()

  const { name, countries, updated_on, id } = project
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
      <ProjectCardHeader>
        <div>
          <h2>{name}</h2>
          <DateAndCountryLabel>{countries.join(', ')}</DateAndCountryLabel>
        </div>
        <ProjectCardHeaderButtonsAndDate onClick={stopEventPropagation}>
          <div>
            <ButtonSecondary
              onClick={stopEventPropagation}
              aria-label="Copy"
              disabled={!isAppOnline}
            >
              <IconCopy />
              <span>Copy</span>
            </ButtonSecondary>
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
          </div>
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
}

export default ProjectCard

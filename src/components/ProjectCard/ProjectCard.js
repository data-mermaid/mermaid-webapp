import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

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

const ProjectCard = ({ project, apiSyncInstance, ...restOfProps }) => {
  const { name, countries, num_sites, offlineReady, updated_on, id } = project
  const history = useHistory()
  const { isOnline: isAppOnline } = useOnlineStatus()
  const [projectOfflineStatus, setProjectOfflineStatus] = useState(offlineReady)
  const projectUrl = `projects/${id}`

  const handleProjectOfflineReadyClick = (event) => {
    const isChecked = event.target.checked

    setProjectOfflineStatus(isChecked)
    if (isChecked) {
      apiSyncInstance
        .pullEverythingButChoices(project.id)
        .then(() =>
          toast.success(
            language.success.getProjectSetOfflineReadySuccess(project.name),
          ),
        )
        .catch(() => {
          toast.error(
            language.error.getProjectSetOfflineReadyFailure(project.name),
          )
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
        <CheckBoxLabel htmlFor="offline-toggle" onClick={stopEventPropagation}>
          <input
            id="offline-toggle"
            type="checkbox"
            checked={projectOfflineStatus}
            onChange={handleProjectOfflineReadyClick}
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
}

export default ProjectCard

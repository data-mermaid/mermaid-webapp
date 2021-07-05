import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

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
import { useOnlineStatus } from '../../library/onlineStatusContext'
import NavLinkButtonGroup from '../NavLinkButtonGroup'
import { pluralize } from '../../library/pluralize'
import stopEventPropagation from '../../library/stopEventPropagation'
import OfflineHide from '../generic/OfflineHide'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'

const ProjectCard = ({ project, ...restOfProps }) => {
  const { name, countries, num_sites, offlineReady, updated_on, id } = project
  const history = useHistory()
  const { isOnline: isAppOnline } = useOnlineStatus()
  const [projectOfflineStatus, setProjectOfflineStatus] = useState(offlineReady)
  const projectUrl = `projects/${id}`

  const handleProjectOfflineReadyClick = (e) => {
    setProjectOfflineStatus(e.target.checked)
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
        <p>{countries.join(',')}</p>
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
          Offline Ready
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
  project: projectPropType.isRequired,
}

export default ProjectCard

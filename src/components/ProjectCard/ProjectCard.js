import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  ButtonGroups,
  CardWrapper,
  CheckBoxLabel,
  ProjectInfoWrapper,
  ProjectNameWrapper,
  VerticalRule,
} from './ProjectCard.styles'
import { ButtonSecondary } from '../generic/buttons'
import { IconCopy } from '../icons'
import { useOnlineStatus } from '../../library/onlineStatusContext'
import NavLinkButtonGroup from '../NavLinkButtonGroup'
import { pluralize } from '../../library/utilities'
import stopEventPropagation from '../../library/stopEventPropagation'

const ProjectCard = ({
  name,
  countries,
  num_sites,
  offlineReady,
  updated_on,
  ...restOfProps
}) => {
  const history = useHistory()
  const { isOnline: isAppOnline } = useOnlineStatus()
  const [projectOfflineStatus, setProjectOfflineStatus] = useState(offlineReady)
  const projectUrl = `projects/${name}`

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
    <CardWrapper onClick={handleCardClick}>
      <ProjectNameWrapper {...restOfProps}>
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
      <ButtonGroups>
        <NavLinkButtonGroup projectUrl={projectUrl} />
        <VerticalRule />
        <ButtonSecondary onClick={handleProjectCopyClick} aria-label="Copy">
          <IconCopy />
          <span>Copy</span>
        </ButtonSecondary>
      </ButtonGroups>
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  num_sites: PropTypes.number.isRequired,
  offlineReady: PropTypes.bool.isRequired,
  updated_on: PropTypes.string.isRequired,
}

export default ProjectCard

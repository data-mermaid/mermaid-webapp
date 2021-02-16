import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import pluralize from '../../library/pluralize'
import {
  RowSpaceBetween,
  RowLeft,
  Column,
} from '../../components/generic/positioning'
import { ButtonSecondary } from '../generic/buttons'
import { IconCopy } from '../icons'
import { NavLinkButtonishIcon } from '../generic/links'
import NavLinkButtonGroup from '../generic/NavLinkButtonGroup'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

/**
 * Describe your component
 */
const ProjectCardLeft = styled(Column)`
  flex-direction: column;

  div:first-child {
    font-size: 2em;
  }
`

const ProjectCardRight = styled(Column)`
  align-items: flex-end;
`

const ButtonGroups = styled(RowLeft)`
  visibility: hidden;
`

const CardWrapper = styled(RowSpaceBetween)`
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 4px 4px 8px darkgrey;

  &:hover {
    border: 1px solid;
    ${ButtonGroups} {
      visibility: visible;
    }
  }
`

const InputCheckBox = styled.input``

const ProjectCard = ({
  name,
  country,
  numberOfSites,
  offlineReady,
  lastUpdatedDate,
}) => {
  const [offlineStatus, setOfflineStatus] = useState(offlineReady)
  const projectUrl = useCurrentProjectPath()

  const toggleOfflineStatus = (e) => {
    setOfflineStatus(e.target.checked)
  }

  return (
    <CardWrapper>
      <ProjectCardLeft>
        <div>{name}</div>
        <div>
          {country} - {numberOfSites}{' '}
          {numberOfSites && pluralize(numberOfSites, 'site', 'sites')}
        </div>
        <ButtonGroups>
          <NavLinkButtonGroup projectUrl={projectUrl} />
          <ButtonSecondary>
            <IconCopy />
          </ButtonSecondary>
          <NavLinkButtonishIcon
            to={`${projectUrl}`}
            aria-label="Project Overview"
          >
            Project Overview
          </NavLinkButtonishIcon>
        </ButtonGroups>
      </ProjectCardLeft>
      <ProjectCardRight>
        <div>
          Offline Ready{' '}
          <InputCheckBox
            id="offline-toggle"
            type="checkbox"
            checked={offlineStatus}
            onChange={toggleOfflineStatus}
          />
        </div>
        <div>Last Updated</div>
        <div>{lastUpdatedDate}</div>
      </ProjectCardRight>
    </CardWrapper>
  )
}

ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  numberOfSites: PropTypes.number.isRequired,
  offlineReady: PropTypes.bool.isRequired,
  lastUpdatedDate: PropTypes.string.isRequired,
}

export default ProjectCard

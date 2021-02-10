import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from '../../library/helpers/pluralize'

/**
 * Describe your component
 */
const ItemRow = styled.div``

const Header = styled(ItemRow)`
  font-size: 2rem;
`

const ButtonGroups = styled.div`
  visibility: hidden;
`
const CardWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  box-shadow: 4px 4px 8px darkgrey;

  &:hover {
    border: 1px solid;
    ${ButtonGroups} {
      visibility: visible;
    }
  }
`

const LeftWrapper = styled.div`
  flex-grow: 1;
`

const RightWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
`

const ProjectCard = ({
  project_name,
  country,
  number_of_sites,
  offline_ready,
  last_updated_date,
}) => {
  const [offlineStatus, setOfflineStatus] = useState(offline_ready)

  const toggleOfflineStatus = (e) => {
    setOfflineStatus(e.target.checked)
  }

  return (
    <CardWrapper>
      <LeftWrapper>
        <Header>{project_name}</Header>
        <ItemRow>
          {country} - {number_of_sites}{' '}
          {number_of_sites && pluralize(number_of_sites, 'site', 'sites')}
        </ItemRow>
        <ButtonGroups>Buttons group</ButtonGroups>
      </LeftWrapper>
      <RightWrapper>
        <ItemRow>
          Offline Ready{' '}
          <input
            id="offline-toggle"
            type="checkbox"
            checked={offlineStatus}
            onChange={toggleOfflineStatus}
          ></input>
        </ItemRow>
        <ItemRow>Last Updated</ItemRow>
        <ItemRow>{last_updated_date}</ItemRow>
      </RightWrapper>
    </CardWrapper>
  )
}

ProjectCard.propTypes = {}

export default ProjectCard

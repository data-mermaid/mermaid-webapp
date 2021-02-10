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
  name,
  country,
  numberOfSites,
  offlineReady,
  lastUpdatedDate,
}) => {
  const [offlineStatus, setOfflineStatus] = useState(offlineReady)

  const toggleOfflineStatus = (e) => {
    setOfflineStatus(e.target.checked)
  }

  return (
    <CardWrapper>
      <LeftWrapper>
        <Header>{name}</Header>
        <ItemRow>
          {country} - {numberOfSites}{' '}
          {numberOfSites && pluralize(numberOfSites, 'site', 'sites')}
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
        <ItemRow>{lastUpdatedDate}</ItemRow>
      </RightWrapper>
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

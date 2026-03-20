import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { choicesPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { getObjectById } from '../../../library/getObjectById'
import theme from '../../../theme'

const PopupContainer = styled('div')`
  padding: 0px 6px;
  & > a {
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px solid;
  }
  & > p {
    margin: 0;
    font-size: ${theme.typography.smallFontSize};
    span {
      font-style: italic;
    }
  }
`

const Popup = ({ properties, choices }) => {
  const { reeftypes, reefzones, reefexposures } = choices

  const reefType = getObjectById(reeftypes.data, properties.reef_type).name
  const reefZone = getObjectById(reefzones.data, properties.reef_zone).name
  const exposure = getObjectById(reefexposures.data, properties.exposure).name
  const linkToSite = `/projects/${properties.project_id}/sites/${properties.id}`

  return (
    <PopupContainer>
      <a href={linkToSite}>{properties.name}</a>
      <p>
        Reef Type: <span>{reefType}</span>{' '}
      </p>
      <p>
        Reef Zone: <span>{reefZone}</span>{' '}
      </p>
      <p>
        Exposure: <span>{exposure}</span>{' '}
      </p>
    </PopupContainer>
  )
}

Popup.propTypes = {
  properties: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    project_id: PropTypes.string,
    reef_type: PropTypes.string,
    reef_zone: PropTypes.string,
    exposure: PropTypes.string,
  }).isRequired,
  choices: choicesPropType.isRequired,
}

export default Popup

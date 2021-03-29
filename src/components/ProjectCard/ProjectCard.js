import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import pluralize from '../../library/pluralize'
import {
  mediaQueryPhoneOnly,
  hoverState,
  mediaQueryForTabletLandscapeUp,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import useOnlineStatus from '../../library/useOnlineStatus'
import { ButtonSecondary } from '../generic/buttons'
import { IconCopy } from '../icons'
import NavLinkButtonGroup from '../NavLinkButtonGroup'

const borderWidth = '2px'
const stylesForNoHover = css`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 0;
  button,
  a {
    font-size: smaller;
    text-align: center;
    span {
      display: block;
    }
  }
`
const ButtonGroups = styled('div')`
  grid-column: 1 / -1;
  margin: ${theme.spacing.small} ${theme.spacing.medium};
  button,
  a {
    display: inline-block;
    position: relative;
    margin-right: ${theme.spacing.small};
    span {
      display: none;
    }
    ${mediaQueryForTabletLandscapeUp(css`
      ${hoverState(css`
        span {
          display: block;
          position: absolute;
          top: 4.3rem;
          left: 0;
          color: ${theme.color.white};
          background-color: ${theme.color.black};
          text-align: center;
          padding: ${theme.spacing.small};
          text-transform: uppercase;
        }
      `)}
    `)}
  }

  @media (hover: hover) {
    visibility: hidden;
  }
  @media (hover: none) {
    ${stylesForNoHover};
    margin: ${theme.spacing.medium};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    ${stylesForNoHover};
    margin-top: ${theme.spacing.medium};
    a,
    button {
      background-color: transparent;
      opacity: 0.6;
      border: none;
      padding: ${theme.spacing.small} 0;
      margin: 0;
    }
  `)}
  ${mediaQueryPhoneOnly(css`
    span {
      font-size: ${theme.typography.xSmallFontSize};
    }
  `)}
`

const CardWrapper = styled('div')`
  display:grid;
  grid-template-columns: 4fr 1fr;
  transition: ${theme.timing.hoverTransition};
  align-items: center;
  margin: ${theme.spacing.medium} auto 0 auto;
  width: ${theme.spacing.width};
  max-width: ${theme.spacing.maxWidth};
  background: ${theme.color.white};
  border: solid ${borderWidth} transparent;
  cursor: pointer;
  ${hoverState(css`
    transition: ${theme.timing.hoverTransition};
    border: solid ${borderWidth} ${theme.color.primaryColor};
    ${ButtonGroups} {
      visibility: visible;
    }
  `)}
  }
  ${mediaQueryTabletLandscapeOnly(css`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`

const ProjectNameWrapper = styled('div')`
  align-self: start;
  h2 {
    margin: ${theme.spacing.xsmall} 0;
    padding: ${theme.spacing.small} ${theme.spacing.medium};
    ${theme.typography.noWordBreak};
    ${theme.typography.upperCase};
    ${mediaQueryTabletLandscapeOnly(css`
      letter-spacing: 0;
    `)}
    ${mediaQueryPhoneOnly(css`
      font-size: ${theme.typography.defaultFontSize};
      padding: ${theme.spacing.small};
    `)}
  }
`

const ProjectInfoWrapper = styled('div')`
  align-self: start;
  margin: ${theme.spacing.small} ${theme.spacing.medium} 0 0;
  p:first-child {
    font-size: larger;
    font-weight: 900;
    ${mediaQueryPhoneOnly(css`
      font-size: initial;
    `)}
  }
  p,
  label {
    font-size: smaller;
    margin: 0;
    padding: 0 ${theme.spacing.medium};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    display: grid;
    grid-template-rows: repeat(4, 1fr);
  `)}
  ${mediaQueryPhoneOnly(css`
    p,
    label {
      padding: 0 ${theme.spacing.small};
    }
  `)}
`
const CheckBoxWithLabel = styled.label`
  padding: ${theme.spacing.xsmall};
  width: 100%;
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const VerticalRule = styled.div`
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
  @media (hover: none) {
    display: none;
  }
  border: solid 1px ${theme.color.secondaryBorder};
  width: 0;
  margin-right: ${theme.spacing.small};
  padding: ${theme.spacing.small} 0;
  display: inline;
`

const ProjectCard = ({
  name,
  countries,
  num_sites,
  offlineReady,
  updated_on,
  ...restOfProps
}) => {
  const history = useHistory()
  const { isOnline } = useOnlineStatus()
  const [offlineStatus, setOfflineStatus] = useState(offlineReady)
  const projectUrl = `projects/${name}`

  const handleProjectOfflineReadyClick = (e) => {
    setOfflineStatus(e.target.checked)
  }

  const handleCardClick = () => {
    const destinationUrl = isOnline
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
        <CheckBoxWithLabel htmlFor="offline-toggle">
          <input
            id="offline-toggle"
            type="checkbox"
            checked={offlineStatus}
            onChange={handleProjectOfflineReadyClick}
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
          Offline Ready
        </CheckBoxWithLabel>
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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import pluralize from '../../library/pluralize'
import {
  hoverState,
  mediaQueryForTabletLandscapeUp,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'
import { noWordBreak } from '../../library/styling/mixins'
import { ButtonSecondary } from '../generic/buttons'
import { IconCopy } from '../icons'
import NavLinkButtonGroup from '../NavLinkButtonGroup'

/**
 * Describe your component
 */
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
  margin: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium};
  button,
  a {
    display:inline-block;
    position: relative;
    margin-right: ${(props) => props.theme.spacing.small};
    span {
      display: none;
    }
    ${mediaQueryForTabletLandscapeUp(css`
      ${hoverState(css`
      span{
        display: block;
        position: absolute;
        top: 4.3rem;
        left: 0;
        color: ${(props) => props.theme.color.white};
        background-color: ${(props) => props.theme.color.black};
        text-align: center;
        padding: ${(props) => props.theme.spacing.small};
        text-transform: uppercase;
      `)}
    `)}
    }
  }
  @media (hover: hover) {
    visibility: hidden;
  }
  @media (hover: none) {
    ${stylesForNoHover};
    margin: ${(props) => props.theme.spacing.medium};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    ${stylesForNoHover};
    margin-top: ${(props) => props.theme.spacing.medium};
    a,
    button {
      background-color: transparent;
      border: none;
      opacity: 0.6;
    }
  `)}
`
const CardWrapper = styled('div')`
  display:grid;
  grid-template-columns: 4fr 1fr;
  transition: ${(props) => props.theme.timing.hoverTransition};
  align-items: center;
  margin: ${(props) => props.theme.spacing.medium} auto 0 auto;
  width: ${(props) => props.theme.spacing.width};
  max-width: ${(props) => props.theme.spacing.maxWidth};
  background: ${(props) => props.theme.color.white};
  border: solid ${borderWidth} transparent;
  ${hoverState(css`
    transition: ${(props) => props.theme.timing.hoverTransition};
    border: solid ${borderWidth} ${(props) => props.theme.color.primaryColor};
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
    margin: ${(props) => props.theme.spacing.xsmall} 0;
    padding-top: ${(props) => props.theme.spacing.small};
    padding-left: ${(props) => props.theme.spacing.medium};
    text-transform: uppercase;
    letter-spacing: 2px;
    ${noWordBreak};
    ${mediaQueryTabletLandscapeOnly(css`
      letter-spacing: 0;
    `)}
  }
`

const ProjectInfoWrapper = styled('div')`
  align-self: start;
  margin: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.medium} 0 0;
  p:first-child {
    font-size: larger;
    font-weight: 900;
  }
  p,
  label {
    font-size: smaller;
    margin: 0;
    padding: 0 ${(props) => props.theme.spacing.medium};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    display: grid;
    grid-template-rows: repeat(4, 1fr);
  `)}
`
const CheckBoxWithLabel = styled.label`
  padding: ${(props) => props.theme.spacing.xsmall};
  width: 100%;
  display: inline-block;
  input {
    margin: 0 ${(props) => props.theme.spacing.xsmall} 0 0;
  }
`

const VerticalRule = styled.div`
  ${mediaQueryTabletLandscapeOnly(css`
    display: none;
  `)}
  @media (hover: none) {
    display: none;
  }
  border: solid 1px ${(props) => props.theme.color.secondaryBorder};
  width: 0;
  margin-right: ${(props) => props.theme.spacing.small};
  padding: ${(props) => props.theme.spacing.small} 0;
  display: inline;
`

const ProjectCard = ({
  name,
  country,
  numberOfSites,
  offlineReady,
  lastUpdatedDate,
}) => {
  const [offlineStatus, setOfflineStatus] = useState(offlineReady)
  const projectUrl = `projects/${name}`

  const toggleOfflineStatus = (e) => {
    setOfflineStatus(e.target.checked)
  }

  return (
    <CardWrapper>
      <ProjectNameWrapper>
        <h2>{name}</h2>
      </ProjectNameWrapper>
      <ProjectInfoWrapper>
        <p>{country}</p>
        <p>
          {numberOfSites}{' '}
          {numberOfSites && pluralize(numberOfSites, 'site', 'sites')}
        </p>
        <CheckBoxWithLabel for="offline-toggle">
          <input
            id="offline-toggle"
            type="checkbox"
            checked={offlineStatus}
            onChange={toggleOfflineStatus}
          />
          Offline Ready
        </CheckBoxWithLabel>
        <p>Updated: {lastUpdatedDate}</p>
      </ProjectInfoWrapper>
      <ButtonGroups>
        <NavLinkButtonGroup projectUrl={projectUrl} />
        <VerticalRule />
        <ButtonSecondary>
          <IconCopy />
          <span>Copy</span>
        </ButtonSecondary>
      </ButtonGroups>
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

import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { NavLinkThatLooksLikeButtonIcon } from '../generic/links'
import { IconCollect, IconData, IconInfo, IconProjectOverview } from '../icons'
import stopEventPropagation from '../../library/stopEventPropagation'
import OfflineHide from '../generic/OfflineHide'

const ButtonLabel = styled('span')``

const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/observers-and-transects`}
          aria-label="Users And Transects"
          onClick={stopEventPropagation}
        >
          <IconProjectOverview />
          <ButtonLabel>Overview</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
      <NavLinkThatLooksLikeButtonIcon
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
        onClick={stopEventPropagation}
      >
        <IconCollect />
        <ButtonLabel>Collecting</ButtonLabel>
      </NavLinkThatLooksLikeButtonIcon>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/submitted`}
          aria-label="Submitted"
          onClick={stopEventPropagation}
        >
          <IconData />
          <ButtonLabel>Submitted</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/project-info`}
          aria-label="Project Info"
          onClick={stopEventPropagation}
        >
          <IconInfo />
          <ButtonLabel>Info</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
    </>
  )
}

NavLinkButtonGroup.propTypes = {
  projectUrl: PropTypes.string.isRequired,
}

export default NavLinkButtonGroup

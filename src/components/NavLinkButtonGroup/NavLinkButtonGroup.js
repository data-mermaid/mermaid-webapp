import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { NavLinkThatLooksLikeButtonIcon } from '../generic/links'
import { IconHeart, IconCollect, IconData, IconAdmin } from '../icons'
import stopEventPropagation from '../../library/stopEventPropagation'
import OfflineHide from '../generic/OfflineHide'

const ButtonLabel = styled('span')``

const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/usersandtransects`}
          aria-label="Usersandtransects"
          onClick={stopEventPropagation}
        >
          <IconHeart />
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
          to={`${projectUrl}/data`}
          aria-label="Data"
          onClick={stopEventPropagation}
        >
          <IconData />
          <ButtonLabel>Submitted</ButtonLabel>
        </NavLinkThatLooksLikeButtonIcon>
      </OfflineHide>
      <OfflineHide>
        <NavLinkThatLooksLikeButtonIcon
          to={`${projectUrl}/admin`}
          aria-label="Admin"
          onClick={stopEventPropagation}
        >
          <IconAdmin />
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

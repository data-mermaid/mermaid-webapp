import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { NavLinkButtonishIcon } from '../generic/links'
import { IconCollect, IconData, IconAdmin, IconHeart } from '../icons'
import stopEventPropagation from '../../library/stopEventPropagation'
import OfflineHide from '../generic/OfflineHide'

const ButtonLabel = styled('span')``

const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <OfflineHide>
        <NavLinkButtonishIcon
          to={`${projectUrl}/health`}
          aria-label="Health"
          onClick={stopEventPropagation}
        >
          <IconHeart />
          <ButtonLabel>Health</ButtonLabel>
        </NavLinkButtonishIcon>
      </OfflineHide>
      <NavLinkButtonishIcon
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
        onClick={stopEventPropagation}
      >
        <IconCollect />
        <ButtonLabel>Collecting</ButtonLabel>
      </NavLinkButtonishIcon>
      <OfflineHide>
        <NavLinkButtonishIcon
          to={`${projectUrl}/data`}
          aria-label="Data"
          onClick={stopEventPropagation}
        >
          <IconData />
          <ButtonLabel>Submitted</ButtonLabel>
        </NavLinkButtonishIcon>
      </OfflineHide>
      <OfflineHide>
        <NavLinkButtonishIcon
          to={`${projectUrl}/admin`}
          aria-label="Admin"
          onClick={stopEventPropagation}
        >
          <IconAdmin />
          <ButtonLabel>Info</ButtonLabel>
        </NavLinkButtonishIcon>
      </OfflineHide>
    </>
  )
}

NavLinkButtonGroup.propTypes = {
  projectUrl: PropTypes.string.isRequired,
}

export default NavLinkButtonGroup

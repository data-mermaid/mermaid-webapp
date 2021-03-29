import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { NavLinkButtonishIcon } from '../generic/links'
import { IconCollect, IconData, IconAdmin, IconHeart } from '../icons'
import stopEventPropagation from '../../library/stopEventPropagation'

const ButtonLabel = styled('span')``

const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <NavLinkButtonishIcon
        to={`${projectUrl}/health`}
        aria-label="Data"
        onClick={stopEventPropagation}
      >
        <IconHeart />
        <ButtonLabel>Health</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
        onClick={stopEventPropagation}
      >
        <IconCollect />
        <ButtonLabel>Collecting</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon
        to={`${projectUrl}/data`}
        aria-label="Data"
        onClick={stopEventPropagation}
      >
        <IconData />
        <ButtonLabel>Submitted</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon
        to={`${projectUrl}/admin`}
        aria-label="Admin"
        onClick={stopEventPropagation}
      >
        <IconAdmin />
        <ButtonLabel>Info</ButtonLabel>
      </NavLinkButtonishIcon>
    </>
  )
}

NavLinkButtonGroup.propTypes = {
  projectUrl: PropTypes.string.isRequired,
}

export default NavLinkButtonGroup

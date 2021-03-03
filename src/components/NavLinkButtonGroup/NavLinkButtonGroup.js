import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { NavLinkButtonishIcon } from '../generic/links'
import { IconCollect, IconData, IconAdmin, IconHeart } from '../icons'
/**
 * Describe your component
 */
const ButtonLabel = styled('span')``
const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <NavLinkButtonishIcon to={`${projectUrl}/`} aria-label="Data">
        <IconHeart />
        <ButtonLabel>Health</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
      >
        <IconCollect />
        <ButtonLabel>Collecting</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon to={`${projectUrl}/data`} aria-label="Data">
        <IconData />
        <ButtonLabel>Submitted</ButtonLabel>
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon to={`${projectUrl}/admin`} aria-label="Admin">
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

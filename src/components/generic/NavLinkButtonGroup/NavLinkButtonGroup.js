import React from 'react'
import PropTypes from 'prop-types'
import { NavLinkButtonishIcon } from '../links'
import { IconCollect, IconData, IconAdmin } from '../../icons'
/**
 * Describe your component
 */
const NavLinkButtonGroup = ({ projectUrl }) => {
  return (
    <>
      <NavLinkButtonishIcon
        to={`${projectUrl}/collecting`}
        aria-label="Collect"
      >
        <IconCollect />
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon to={`${projectUrl}/data`} aria-label="Data">
        <IconData />
      </NavLinkButtonishIcon>
      <NavLinkButtonishIcon to={`${projectUrl}/admin`} aria-label="Admin">
        <IconAdmin />
      </NavLinkButtonishIcon>
    </>
  )
}

NavLinkButtonGroup.propTypes = {
  projectUrl: PropTypes.string.isRequired,
}

export default NavLinkButtonGroup

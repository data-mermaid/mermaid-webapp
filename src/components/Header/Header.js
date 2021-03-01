import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { currentUserPropType } from '../../ApiServices/useMermaidApi'
import { RowSpaceBetween, RowRight } from '../generic/positioning'
import ButtonMenu from '../generic/ButtonMenu'

/**
 * Mermaid Header
 */

const Header = ({ logout, isOnline, currentUser }) => {
  const userMenuItems = useMemo(
    () => (isOnline ? [{ label: 'Logout', onClick: logout }] : []),
    [isOnline, logout],
  )

  return (
    <RowSpaceBetween>
      Header
      <RowRight as="nav">
        <Link to="/projects">Projects</Link>
        <Link to="/#">Reports</Link>
        <Link to="/#">Reference</Link>
        <Link to="/#">Global Dashboard</Link>

        <ButtonMenu label={currentUser.first_name} items={userMenuItems} />
      </RowRight>
    </RowSpaceBetween>
  )
}

Header.propTypes = {
  currentUser: currentUserPropType,
  isOnline: PropTypes.bool.isRequired,
  logout: PropTypes.func,
}
Header.defaultProps = {
  currentUser: undefined,
  logout: () => {},
}

export default Header

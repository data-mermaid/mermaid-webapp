import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import ButtonMenu from '../generic/ButtonMenu'
import { RowSpaceBetween, RowRight } from '../generic/positioning'

/**
 * Mermaid Header
 */

const Header = ({ logout, isOnline }) => {
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
        <ButtonMenu label="Fake User" items={userMenuItems} />
      </RowRight>
    </RowSpaceBetween>
  )
}

Header.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  logout: PropTypes.func,
}
Header.defaultProps = {
  logout: () => {},
}

export default Header

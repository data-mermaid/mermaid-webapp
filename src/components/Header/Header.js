import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import ButtonMenu from '../generic/ButtonMenu'
import { RowSpaceBetween, RowRight } from '../generic/positioning'

/**
 * Mermaid Header
 */

const Header = ({ logout, isOnline }) => {
  const userMenuItems = []

  const _showLogoutButtonIfOnline = useEffect(() => {
    if (isOnline) {
      userMenuItems.push({ label: 'Logout', onClick: logout })
    }
  }, [isOnline, userMenuItems])

  return (
    <RowSpaceBetween>
      Header
      <RowRight as="nav">
        <Link to="/projects">Projects</Link>
        <Link to="/#">Reports</Link>
        <Link to="/#">Reference</Link>
        <Link to="/#">Global Dashboard</Link>
        <ButtonMenu label="placeholder" items={userMenuItems} />
      </RowRight>
    </RowSpaceBetween>
  )
}

Header.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}

export default Header

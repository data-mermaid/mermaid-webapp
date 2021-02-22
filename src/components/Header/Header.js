import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import ButtonMenu from '../generic/ButtonMenu'
import { RowSpaceBetween, RowRight } from '../generic/positioning'

/**
 * Mermaid Header
 */

const Header = ({ logout }) => {
  return (
    <RowSpaceBetween>
      Header
      <RowRight as="nav">
        <Link to="/projects">Projects</Link>
        <Link to="/#">Reports</Link>
        <Link to="/#">Reference</Link>
        <Link to="/#">Global Dashboard</Link>
        <ButtonMenu
          label="placeholder"
          items={[{ label: 'Logout', onClick: logout }]}
        />
      </RowRight>
    </RowSpaceBetween>
  )
}

Header.propTypes = { logout: PropTypes.func.isRequired }

export default Header

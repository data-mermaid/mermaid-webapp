import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import ButtonMenu from '../generic/ButtonMenu'
import { RowSpaceBetween, RowRight } from '../generic/positioning'

/**
 * Mermaid Header
 */

const Nav = styled.nav`
  & > * {
    margin-right: ${(props) => props.theme.spacing.small};
  }
`

const Header = () => {
  const { logout, user } = useAuth0()

  return (
    <RowSpaceBetween>
      Header
      <RowRight>
        <Nav>
          <Link to="/projects">Projects</Link>
          <Link to="/#">Reports</Link>
          <Link to="/#">Reference</Link>
          <Link to="/#">Global Dashboard</Link>
        </Nav>
        <ButtonMenu
          label={user.name}
          items={[{ label: 'Logout', onClick: logout }]}
        />
      </RowRight>
    </RowSpaceBetween>
  )
}

Header.propTypes = {}

export default Header

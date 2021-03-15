import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { RowSpaceBetween, RowRight, RowLeft } from '../generic/positioning'
import OfflineToggle from '../OfflineToggle'
import { IconRefresh } from '../icons'

const IconStyleWrapper = styled.div`
  color: grey;
`

const Footer = () => {
  return (
    <RowSpaceBetween>
      <RowLeft>
        <div>© 2021 Mermaid Version v1.0.0</div>
        <OfflineToggle />
        <IconStyleWrapper>
          <IconRefresh />
        </IconStyleWrapper>
      </RowLeft>
      <RowRight as="nav">
        <Link to="/#">Help</Link>
        <Link to="/#">Terms</Link>
        <Link to="/#">Contact</Link>
        <Link to="/#">Changelog</Link>
        <Link to="/#">Credits</Link>
      </RowRight>
    </RowSpaceBetween>
  )
}

Footer.propTypes = {}

export default Footer

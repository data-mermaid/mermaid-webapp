import React from 'react'
import { Link } from 'react-router-dom'
import { RowSpaceBetween, RowRight, RowLeft } from '../generic/positioning'

/**
 * Describe your component
 */

const Footer = () => {
  return (
    <RowSpaceBetween>
      <RowLeft>
        <div>© 2021 Mermaid Version v1.0.0</div>
        <div>Offline Toggle</div>
        <div>Refresh</div>
      </RowLeft>
      <RowRight>
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

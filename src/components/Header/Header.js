import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Describe your component
 */
const Header = () => {
  return (
    <>
      Header{' '}
      <nav>
        <Link to="/projects">Projects</Link>
      </nav>
    </>
  )
}

Header.propTypes = {}

export default Header

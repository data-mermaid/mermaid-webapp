import React from 'react'
import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const Layout = ({ children, nav, header, footer }) => {
  return (
    <>
      {header}
      {nav}
      <main>{children}</main>
      {footer}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  nav: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
}

export default Layout

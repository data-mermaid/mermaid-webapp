import React from 'react'
import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const Layout = ({ breadcrumbs, children, footer, header }) => {
  return (
    <>
      {header}
      {breadcrumbs}
      <main>{children}</main>
      {footer}
    </>
  )
}

Layout.propTypes = {
  breadcrumbs: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
}

export default Layout

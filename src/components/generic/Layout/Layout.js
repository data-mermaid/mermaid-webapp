import React from 'react'
import PropTypes from 'prop-types'
import { Column } from '../positioning'

/**
 * Basic stacked layout
 */

const Layout = ({ breadcrumbs, children, footer, header }) => {
  return (
    <Column>
      {header}
      {breadcrumbs}
      <main>{children}</main>
      {footer}
    </Column>
  )
}

Layout.propTypes = {
  breadcrumbs: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
}

export default Layout

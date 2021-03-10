import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import { Column } from '../positioning'

/**
 * Basic stacked layout
 */

const LayoutContainer = styled(Column)`
  & main {
    flex-grow: 2;
  }
  height: 100vh;
`

const Layout = ({ children, footer, header }) => {
  return (
    <LayoutContainer>
      {header}
      <main>{children}</main>
      {footer}
    </LayoutContainer>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
}

export default Layout

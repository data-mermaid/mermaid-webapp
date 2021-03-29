import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

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
const OfflineIndicatorStyles = styled.div`
  ${(props) =>
    !props.isOnline &&
    css`
      border: solid thick red;
    `}
`

const OfflineIndicator = ({ children }) => {
  const { isOnline } = useOnlineStatus()

  return (
    <OfflineIndicatorStyles isOnline={isOnline}>
      {children} {!isOnline && <>LABEL</>}
    </OfflineIndicatorStyles>
  )
}

OfflineIndicator.propTypes = { children: PropTypes.node.isRequired }

const Layout = ({ children, footer, header }) => {
  return (
    <LayoutContainer>
      <OfflineIndicator>
        {header}
        <main>{children}</main>
      </OfflineIndicator>

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

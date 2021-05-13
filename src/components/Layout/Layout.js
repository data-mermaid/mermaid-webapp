import PropTypes from 'prop-types'
import React from 'react'
import theme from '../../theme'
import { hoverState } from '../../library/styling/mediaQueries'
import styled, { css } from 'styled-components/macro'
import { useOnlineStatus } from '../../library/onlineStatusContext'

import { Column } from '../generic/positioning'

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
      border: solid ${theme.spacing.borderXLarge} ${theme.color.cautionColor};
      pointer-events: none;
      width: ${theme.spacing.fullViewportWidth};
      height: 100vh;
      z-index: 9998;
      position: fixed;
      span {
        background: ${theme.color.cautionColor};
        color: ${theme.color.white};
        position: absolute;
        bottom: 0;
        left: 10px;
        padding: ${theme.spacing.xsmall} ${theme.spacing.small};
        font-size: smaller;
        transition: ${theme.timing.hoverTransition};
      }
    `}
`
const OfflineIndicator = ({ children }) => {
  const { isOnline } = useOnlineStatus()

  return (
    <OfflineIndicatorStyles isOnline={isOnline}>
      {children} {!isOnline && <span>You're offline</span>}
    </OfflineIndicatorStyles>
  )
}

OfflineIndicator.propTypes = { children: PropTypes.node.isRequired }
const Layout = ({ children, footer, header }) => {
  return (
    <LayoutContainer>
      <OfflineIndicator></OfflineIndicator>
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

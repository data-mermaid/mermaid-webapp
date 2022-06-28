import styled, { css } from 'styled-components/macro'

import theme from '../../theme'
import { CloseButton } from '../generic/buttons'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'

export const NotificationCardWrapper = styled('div')`
  width: 80vw;
  max-width: 40rem;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
`

export const NotificationCard = styled('div')`
  &&& { // Increase specificity
    display: flex;
  }
  margin: ${theme.spacing.small} ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  background-color: white;
  width: 97%;
  color: ${theme.color.primaryColor};
  ${css`
    h1 {
      font-size: small;
    };
    span {
      font-size: ${theme.typography.smallFontSize};
      color: ${theme.color.black};
    }

  `}
`

export const NotificationCloseButton = styled(CloseButton)`
  &&& {
    margin-left: auto;
    ${mediaQueryTabletLandscapeOnly(css`
      height: auto;
      width: auto;
    `)}
  }
`

export const NotificationContent = styled('span')`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export const NotificationDate = styled('span')`
  font-size: ${theme.typography.smallFontSize};
  &&& {
    color: ${theme.color.primaryColor};
  }
`

export const NotificationHeader = styled('span')`
  display:flex; 
  flex-grow: 1;
`

const getNotificationStatusColor = (props) => {
  const statusColors = {
    info: theme.color.infoColor,
    warning: theme.color.warningColor,
    error: theme.color.cautionColor,
  }

  if (!props.status) { return theme.infoColor }

  return statusColors[props.status] || theme.infoColor
}

export const NotificationStatus = styled('span')`
  flex-shrink: 0;
  width: ${theme.spacing.small};
  background-color: ${(props) => getNotificationStatusColor(props)};
  margin: ${theme.spacing.small} ${theme.spacing.medium} 0 0;
}
`

export const NoNotifications = styled('div')`
  padding: ${theme.spacing.small} ${theme.spacing.large};
`

import styled from 'styled-components/macro'

import theme from '../../theme'
import { CloseButton } from '../generic/buttons'

export const NotificationCardWrapper = styled('div')`
  background: ${theme.color.grey1};
  width: 80vw;
  max-width: 40rem;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  position: absolute;
  right: 0;
`

export const NotificationCard = styled('div')`
  display: grid;
  grid-template-columns: calc(${theme.spacing.medium} * 2) auto;
  margin: ${theme.spacing.medium};
  background: ${theme.color.grey5};
  padding: ${theme.spacing.medium};
`

export const NotificationCloseButton = styled(CloseButton)`
  margin-left: auto;
`

export const NotificationContent = styled('div')``

export const NotificationDate = styled('p')`
  font-size: ${theme.typography.smallFontSize};
  opacity: 0.7;
  color: initial;
`

export const NotificationHeader = styled('div')`
  display: flex;
  flex-grow: 1;
`
export const NotificationTitle = styled('p')`
  font-weight: 700;
  margin-bottom: 0;
`

const getNotificationStatusColor = (props) => {
  const statusColors = {
    info: theme.color.infoColor,
    warning: theme.color.warningColor,
    error: theme.color.cautionColor,
  }

  if (!props.status) {
    return theme.infoColor
  }

  return statusColors[props.status] || theme.infoColor
}

export const NotificationStatus = styled('span')`
  width: ${theme.spacing.medium};
  background-color: ${(props) => getNotificationStatusColor(props)};
}
`

export const NoNotifications = styled('div')`
  padding: ${theme.spacing.large};
  text-align: center;
  background: ${theme.color.grey1};
  color: ${theme.color.textColor};
`

import styled from 'styled-components'

import theme from '../../theme'

export const NotificationCardWrapper = styled('div')`
  background: ${theme.color.grey1};
  width: 80vw;
  max-width: 40rem;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  position: absolute;
  right: 0;
  padding: ${theme.spacing.medium};
`
export const NotificationCard = styled('div')`
  display: grid;
  grid-template-columns: calc(${theme.spacing.medium} * 2) auto;
  margin: ${theme.spacing.medium} 0;
  background: ${theme.color.grey5};
  padding: ${theme.spacing.medium};
`
export const NotificationHeader = styled('div')`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
`
export const NotificationTitle = styled('p')`
  font-weight: 700;
  margin: 0;
`
export const NotificationDateWrapper = styled('div')`
  * {
    opacity: 0.7;
    margin: 0;
    color: ${theme.color.secondary};
  }
`
export const NotificationActualDate = styled('p')`
  font-size: ${theme.typography.xSmallFontSize};
`
export const NotificationContent = styled('div')`
  word-wrap: break-word;
  word-break: break-word; /* Ensure words break */
  overflow-wrap: break-word; /* Ensure words wrap */
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

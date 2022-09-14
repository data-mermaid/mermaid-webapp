import React from 'react'
import moment from 'moment'
import styled from 'styled-components/macro'

import {
  NotificationCard,
  NotificationCardWrapper,
  NotificationCloseButton,
  NotificationContent,
  NotificationTitle,
  NotificationDate,
  NotificationHeader,
  NotificationStatus,
  NoNotifications,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import language from '../../language'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { TooltipWithText, TooltipPopup, Tooltip } from '../generic/tooltip'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'

const DateTimeTooltip = styled(TooltipWithText)`
  ${TooltipPopup} {
    width: auto;
    min-width: max-content;
    text-align: center;
  }
  ${Tooltip} {

  }
`

const BellNotificationDropDown = () => {
  const { notifications, deleteNotification } = useBellNotifications()

  const dismissNotification = (event, id) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  if (!notifications?.results || !notifications.results?.length) {
    return (
      <NotificationCardWrapper>
        <NoNotifications>
          <em>{language.header.noNotifications}</em>
        </NoNotifications>
      </NotificationCardWrapper>
    )
  }

  const sortedNotifications = sortArrayByObjectKey(notifications.results, 'created_on', false)

  return (
    <NotificationCardWrapper>
      {sortedNotifications.map((notification) => {
        const dateTime = moment(notification.created_on)

          return (
            <NotificationCard key={`notification-card-${notification.id}`}>
              <NotificationStatus status={notification.status} />
              <NotificationContent>
                <NotificationHeader>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationCloseButton
                    onClick={(event) => dismissNotification(event, notification.id)}
                  >
                    <IconClose aria-label="close" />
                  </NotificationCloseButton>
                </NotificationHeader>
                <p>{notification.description}</p>
                <DateTimeTooltip
                  id={`aria-tooltip-label${notification.id}`}
                  text={dateTime.fromNow()}
                  forwardedAs={NotificationDate}
                  tooltipText={dateTime.format('LLLL')}
                />
              </NotificationContent>
            </NotificationCard>
          )
      }
      )}

    </NotificationCardWrapper>

  )

}

export default BellNotificationDropDown

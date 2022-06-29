import React from 'react'

import {
  NotificationCard,
  NotificationCardWrapper,
  NotificationCloseButton,
  NotificationContent,
  NotificationDate,
  NotificationHeader,
  NotificationStatus,
  NoNotifications,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import language from '../../language'
import { useBellNotifications } from '../../App/BellNotificationContext'

const getUpdatedOnText = (createdOn) => {
  const locale = navigator.language ?? 'en-US'

  const date = new Date(createdOn)
  const dateText = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeText = date.toLocaleTimeString(locale)

  return `${dateText}, ${timeText}`
}

const BellNotificationDropDown = () => {
  const { notifications, deleteNotification } = useBellNotifications()

  const dismissNotification = (event, id) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  return (
    <NotificationCardWrapper>
      {!notifications?.results || !notifications.results?.length ? (
        <NoNotifications>{language.header.noNotifications}</NoNotifications>
      ) : (
        notifications.results.map((notification) => {
          return (
            <NotificationCard key={`notification-card-${notification.id}`}>
              <NotificationStatus status={notification.status} />
              <NotificationContent>
                <NotificationHeader>
                  <h1>{notification.title}</h1>
                  <NotificationCloseButton
                    onClick={(event) => dismissNotification(event, notification.id)}
                  >
                    <IconClose aria-label="close" />
                  </NotificationCloseButton>
                </NotificationHeader>
                <NotificationDate>{getUpdatedOnText(notification.created_on)}</NotificationDate>
                <span>{notification.description}</span>
              </NotificationContent>
            </NotificationCard>
          )
        })
      )}
    </NotificationCardWrapper>
  )
}

export default BellNotificationDropDown

import React from 'react'
import moment from 'moment'

import {
  NotificationCard,
  NotificationCardWrapper,
  NotificationCloseButton,
  NotificationContent,
  NotificationTitle,
  NotificationDateWrapper,
  NotificationTimeAgoDate,
  NotificationActualDate,
  NotificationHeader,
  NotificationStatus,
  NoNotifications,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import language from '../../language'
import { useBellNotifications } from '../../App/BellNotificationContext'

const BellNotificationDropDown = () => {
  const { notifications, deleteNotification } = useBellNotifications()

  const dismissNotification = (event, id) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  return (
    <NotificationCardWrapper>
      {!notifications?.results || !notifications.results?.length ? (
        <NoNotifications>
          <em>{language.header.noNotifications}</em>
        </NoNotifications>
      ) : (
        notifications.results.map((notification) => {
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
                <NotificationDateWrapper>
                  <NotificationTimeAgoDate>{dateTime.fromNow()}</NotificationTimeAgoDate>
                  <NotificationActualDate>{dateTime.format('LLLL')}</NotificationActualDate>
                </NotificationDateWrapper>
              </NotificationContent>
            </NotificationCard>
          )
        })
      )}
    </NotificationCardWrapper>
  )
}

export default BellNotificationDropDown

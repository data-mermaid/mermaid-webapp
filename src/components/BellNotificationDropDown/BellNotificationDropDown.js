import React from 'react'
import moment from 'moment'
import domPurify from 'dompurify'

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
  DismissButtonSecondary,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import language from '../../language'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'

const sanitizeHtml = domPurify.sanitize

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
      <DismissButtonSecondary>{language.header.dismissAllNotifications}</DismissButtonSecondary>
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
              {/*  eslint-disable-next-line react/no-danger */}
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(notification.description) }} />
              <NotificationDateWrapper>
                <NotificationTimeAgoDate>{dateTime.fromNow()}</NotificationTimeAgoDate>
                <NotificationActualDate>{dateTime.format('LLLL')}</NotificationActualDate>
              </NotificationDateWrapper>
            </NotificationContent>
          </NotificationCard>
        )
      })}
    </NotificationCardWrapper>
  )
}

export default BellNotificationDropDown

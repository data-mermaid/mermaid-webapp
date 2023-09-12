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
  const { notifications, deleteNotification, deleteAllNotifications } = useBellNotifications()

  const dismissNotification = (event, id) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  const dismissAllNotifications = (event) => {
    deleteAllNotifications()
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
      <DismissButtonSecondary onClick={(event) => dismissAllNotifications(event)}>
        {language.header.dismissAllNotifications}
      </DismissButtonSecondary>
      {sortedNotifications.map((notification) => {
        const dateTime = moment(notification.created_on)

        const dirtyHTML = notification.description

        const cleanHTML = sanitizeHtml(dirtyHTML, { ADD_ATTR: ['target'] })

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
              <p dangerouslySetInnerHTML={{ __html: cleanHTML }} />
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

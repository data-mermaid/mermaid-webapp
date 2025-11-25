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
import { useBellNotifications } from '../../App/BellNotificationContext'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { useTranslation } from 'react-i18next'

const sanitizeHtml = domPurify.sanitize

const BellNotificationDropDown = () => {
  const { t } = useTranslation()
  const { notifications, deleteNotification, deleteAllNotifications } = useBellNotifications()

  const dismissNotification = (event, id) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  const dismissAllNotifications = (event) => {
    deleteAllNotifications()
    event.stopPropagation()
  }

  if (!notifications || !notifications.length) {
    return (
      <NotificationCardWrapper>
        <NoNotifications>
          <em>{t('no_notifications')}</em>
        </NoNotifications>
      </NotificationCardWrapper>
    )
  }

  const sortedNotifications = sortArrayByObjectKey(notifications, 'created_on', false)

  return (
    <NotificationCardWrapper>
      <DismissButtonSecondary onClick={(event) => dismissAllNotifications(event)}>
        {t('buttons.dismiss_all_notifications')}
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
                  <IconClose aria-label={t('buttons.close')} />
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

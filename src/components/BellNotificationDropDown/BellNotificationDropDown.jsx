import React from 'react'
import domPurify from 'dompurify'
import {
  NoNotifications,
  NotificationActualDate,
  NotificationCard,
  NotificationCardWrapper,
  NotificationContent,
  NotificationDateWrapper,
  NotificationHeader,
  NotificationStatus,
  NotificationTitle,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { formatDateTimeIntl, formatDistanceNoQuarters } from '../../library/formatDateTime'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary, CloseButton } from '../generic/buttons.js'

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
      <ButtonSecondary
        id="gtm-dismiss-all-notifications"
        width="100%"
        onClick={(event) => dismissAllNotifications(event)}
      >
        {t('buttons.dismiss_all_notifications')}
      </ButtonSecondary>
      {sortedNotifications.map((notification) => {
        const dateTime = new Date(notification.created_on)
        const distanceToNow = formatDistanceNoQuarters(new Date(), dateTime) // e.g. "2 hours ago"

        const intlFormattedDateTime = formatDateTimeIntl(dateTime) // e.g. "Wednesday, February 4, 2026 at 2:34 PM"

        const dirtyHTML = notification.description

        const cleanHTML = sanitizeHtml(dirtyHTML, { ADD_ATTR: ['target'] })

        return (
          <NotificationCard key={`notification-card-${notification.id}`}>
            <NotificationStatus $status={notification.status} />
            <NotificationContent>
              <NotificationHeader>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <CloseButton
                  id="gtm-dismiss-one-notification"
                  onClick={(event) => dismissNotification(event, notification.id)}
                >
                  <IconClose aria-label={t('buttons.close')} />
                </CloseButton>
              </NotificationHeader>
              {/*  eslint-disable-next-line react/no-danger */}
              <p dangerouslySetInnerHTML={{ __html: cleanHTML }} />
              <NotificationDateWrapper>
                <p>{distanceToNow}</p>
                <NotificationActualDate>{intlFormattedDateTime}</NotificationActualDate>
              </NotificationDateWrapper>
            </NotificationContent>
          </NotificationCard>
        )
      })}
    </NotificationCardWrapper>
  )
}

export default BellNotificationDropDown

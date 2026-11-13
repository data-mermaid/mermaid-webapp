import React from 'react'
import domPurify from 'dompurify'
import {
  NoNotifications,
  NotificationActualDate,
  NotificationCard,
  NotificationCardWrapper,
  NotificationContent,
  NotificationDateWrapper,
  NotificationGroupHeading,
  NotificationHeader,
  NotificationStatus,
  NotificationTitle,
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'
import { useBellNotifications } from '../../App/BellNotificationContext'
import { formatDateTimeIntl, formatDistanceNoQuarters } from '../../library/formatDateTime'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary, CloseButton } from '../generic/buttons.js'
import type { Notification } from '../../App/mermaidData/mermaidDataTypes'

type BellNotification = Notification['results'][number]

interface BellNotifications {
  notifications: BellNotification[]
  deleteNotification: (id: string) => void
  deleteAllNotifications: () => void
}

const sanitizeHtml = domPurify.sanitize

const RELEASE_STATUS = 'release'
const STATUS_ORDER = ['error', 'warning', 'info']

const byNewestFirst = (a: BellNotification, b: BellNotification) =>
  new Date(b.created_on).getTime() - new Date(a.created_on).getTime()

const BellNotificationDropDown = () => {
  const { t } = useTranslation()
  const { notifications, deleteNotification, deleteAllNotifications }: BellNotifications =
    useBellNotifications()

  const dismissNotification = (event: React.MouseEvent, id: string) => {
    deleteNotification(id)
    event.stopPropagation()
  }

  const dismissAllNotifications = (event: React.MouseEvent) => {
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

  const releaseNotifications = notifications
    .filter((notification) => notification.status === RELEASE_STATUS)
    .sort(byNewestFirst)
  const otherNotifications = notifications
    .filter((notification) => notification.status !== RELEASE_STATUS)
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || byNewestFirst(a, b),
    )

  const renderNotificationCard = (notification: BellNotification) => {
    const dateTime = new Date(notification.created_on)
    const distanceToNow = formatDistanceNoQuarters(dateTime, new Date()) // e.g. "2 hours ago"

    const intlFormattedDateTime = formatDateTimeIntl(dateTime) // e.g. "Wednesday, February 4, 2026 at 14:34"

    const dirtyHTML = notification.description

    const cleanHTML = sanitizeHtml(dirtyHTML, { ADD_ATTR: ['target'] })

    return (
      <NotificationCard key={`notification-card-${notification.id}`}>
        <NotificationStatus $status={notification.status} />
        <NotificationContent>
          <NotificationHeader>
            <NotificationTitle>{notification.title}</NotificationTitle>
            <CloseButton
              id={
                notification.status === RELEASE_STATUS
                  ? 'gtm-dismiss-one-release'
                  : 'gtm-dismiss-one-notification'
              }
              onClick={(event: React.MouseEvent) => dismissNotification(event, notification.id)}
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
  }

  return (
    <NotificationCardWrapper>
      <ButtonSecondary
        id="gtm-dismiss-all-notifications"
        onClick={(event: React.MouseEvent) => dismissAllNotifications(event)}
      >
        {t('buttons.dismiss_all_notifications')}
      </ButtonSecondary>
      {releaseNotifications.length > 0 && (
        <>
          <NotificationGroupHeading>{t('updates_heading')}</NotificationGroupHeading>
          {releaseNotifications.map(renderNotificationCard)}
        </>
      )}
      {otherNotifications.length > 0 && (
        <>
          <NotificationGroupHeading>{t('notifications_heading')}</NotificationGroupHeading>
          {otherNotifications.map(renderNotificationCard)}
        </>
      )}
    </NotificationCardWrapper>
  )
}

export default BellNotificationDropDown

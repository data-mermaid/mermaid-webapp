import React from 'react'
import {
  NotificationCard,
  NotificationCardWrapper,
  NotificationCloseButton,
  NotificationContent,
  NotificationHeader,
  NotificationStatus
} from './BellNotificationDropDown.styles'
import { IconClose } from '../icons'

const mockNotifications = [
  {
    title: 'a notification',
    status: 'error',
    description: 'description for this notification. these could get quite long',
    owner: 'name'
  },
  {
    title: 'another notification',
    status: 'info',
    description: 'description for this notification. these could get quite long. this one is the longest in the example by far',
    owner: 'name'
  },
  {
    title: 'another notification',
    status: 'warning',
    description: 'description for this notification',
    owner: 'name'
  },
  {
    title: 'and some more',
    status: 'warning',
    description: 'description for this notification',
    owner: 'name'
  }
]

const BellNotificationDropDown = () => (
  <NotificationCardWrapper>
    {mockNotifications.map((notification) => {
      return <NotificationCard>
        <NotificationStatus status={notification.status} />
        <NotificationContent>
          <NotificationHeader>
            <h1>{notification.title}</h1>
            <NotificationCloseButton><IconClose aria-label="close" /></NotificationCloseButton>
          </NotificationHeader>
          <span>{notification.description}</span>
        </NotificationContent>
      </NotificationCard>
    })}
  </NotificationCardWrapper>
)

export default BellNotificationDropDown

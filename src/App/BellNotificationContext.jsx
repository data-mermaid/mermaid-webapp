import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import { notificationsPropType } from './mermaidData/mermaidDataProptypes'

const BellNotificationContext = createContext()

const BellNotificationProvider = ({ children, value = {} }) => {
  return (
    <BellNotificationContext.Provider value={value}>{children}</BellNotificationContext.Provider>
  )
}

const useBellNotifications = () => {
  const context = useContext(BellNotificationContext)

  if (context === undefined) {
    throw new Error(
      'useBellNotifications must be used within a BellNotificationsProvider component',
    )
  }

  return context
}

BellNotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: notificationsPropType,
}

export { useBellNotifications, BellNotificationProvider }

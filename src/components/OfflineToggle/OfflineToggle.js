import React from 'react'
import { useOnlineStatus } from '../../library/onlineStatusContext'

const OfflineToggle = (props) => {
  const { isAppOnline, canUserOverrideOnlineStatus, toggleUserOnlineStatusOverride } =
    useOnlineStatus()

  return (
    <input
      {...props}
      data-testid="offline-toggle-switch-test"
      type="checkbox"
      onChange={toggleUserOnlineStatusOverride}
      checked={!isAppOnline}
      disabled={!canUserOverrideOnlineStatus}
    />
  )
}

export default OfflineToggle

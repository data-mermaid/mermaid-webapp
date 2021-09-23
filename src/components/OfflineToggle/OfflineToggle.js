import React from 'react'
import { useOnlineStatus } from '../../library/onlineStatusContext'

const OfflineToggle = () => {
  const {
    isAppOnline,
    canUserOverrideOnlineStatus,
    toggleUserOnlineStatusOverride,
  } = useOnlineStatus()

  return (
    <label id="offline-toggle-label" htmlFor="offline-toggle-switch">
      <input
        id="offline-toggle-switch"
        data-testid="offline-toggle-switch-test"
        aria-label="offline-toggle-switch-label"
        type="checkbox"
        onChange={toggleUserOnlineStatusOverride}
        checked={!isAppOnline}
        disabled={!canUserOverrideOnlineStatus}
      />
    </label>
  )
}

export default OfflineToggle

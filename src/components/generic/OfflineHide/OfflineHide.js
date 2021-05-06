import React from 'react'
import PropTypes from 'prop-types'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const OfflineHide = ({ children }) => {
  const { isOnline: isAppOnline } = useOnlineStatus()

  return isAppOnline && <>{children}</>
}

OfflineHide.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OfflineHide

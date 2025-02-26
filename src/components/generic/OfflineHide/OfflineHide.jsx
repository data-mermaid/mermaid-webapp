import React from 'react'
import PropTypes from 'prop-types'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const OfflineHide = ({ children }) => {
  const { isAppOnline } = useOnlineStatus()

  return isAppOnline ? <>{children}</> : null
}

OfflineHide.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OfflineHide

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const OfflineContainer = styled.div`
  display: ${(props) => (props.offline ? 'none' : 'inline')};
`

const OfflineHide = ({ children }) => {
  const { isOnline: isAppOnline } = useOnlineStatus()

  return <OfflineContainer offline={!isAppOnline}>{children}</OfflineContainer>

  // below is other way which looks kinda awful, but don't have to deal with css
  // const offlineHideContainer = isAppOnline && <>{children}</>

  // return <>{offlineHideContainer}</>
}

OfflineHide.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OfflineHide

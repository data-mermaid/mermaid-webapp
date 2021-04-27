import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const OfflineControlContainer = styled.div`
  display: ${(props) => (props.isAppOnline ? 'inline' : 'none')};
`

const OfflineHide = ({ children }) => {
  const { isOnline: isAppOnline } = useOnlineStatus()

  return (
    <OfflineControlContainer isAppOnline={isAppOnline}>{children}</OfflineControlContainer>
  )

  // below is other way which looks kinda awful, but don't have to deal with css
  // const offlineHideContainer = isAppOnline && <>{children}</>

  // return <>{offlineHideContainer}</>
}

OfflineHide.propTypes = {
  children: PropTypes.node.isRequired,
}

export default OfflineHide

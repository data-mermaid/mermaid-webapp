import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const LoadingIndicator = (props) => {
  return (
    <FontAwesomeIcon
      icon={faCog}
      spin
      aria-label="loading indicator"
      {...props}
    />
  )
}

export default LoadingIndicator

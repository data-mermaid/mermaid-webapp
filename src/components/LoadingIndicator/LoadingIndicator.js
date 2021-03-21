import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const LoadingIndicator = () => {
  return <FontAwesomeIcon icon={faCog} spin aria-label="loading indicator" />
}

export default LoadingIndicator

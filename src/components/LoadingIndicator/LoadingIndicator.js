import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styled from 'styled-components'

const LoadingIndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const LoadingIndicator = (props) => {
  return (
    <LoadingIndicatorContainer>
      <FontAwesomeIcon
        icon={faCog}
        spin
        aria-label="loading indicator"
        {...props}
      />
    </LoadingIndicatorContainer>
  )
}

export default LoadingIndicator

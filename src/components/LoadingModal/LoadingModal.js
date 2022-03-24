import React, { useEffect, useState } from 'react'

import { StyledDialogOverlay, ModalContent } from '../generic/Modal/Modal'
import LoadingIndicator from '../LoadingIndicator'

const LoadingModal = () => {
  const [loadingSeconds, setLoadingSeconds] = useState(0)
  const intervalMs = 1000

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingSeconds(loadingSeconds + 1)
    }, intervalMs)

    return () => {
      clearInterval(interval)
    }
  })

  const getLoadingIndicator = () => {
    if (loadingSeconds >= 10) {
      return <LoadingIndicator displaySecondary={true}/>
    }

    return <LoadingIndicator />
  }

  return (loadingSeconds >= 1) && (
    <StyledDialogOverlay>
      <ModalContent>
        {getLoadingIndicator()}
      </ModalContent>
    </StyledDialogOverlay>
  )
}

export default LoadingModal

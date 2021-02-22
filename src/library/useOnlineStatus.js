import { useEffect, useState } from 'react'

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false)

  const handleOnline = () => {
    setIsOnline(true)
  }
  const handleOffline = () => {
    setIsOnline(false)
  }
  const cleanup = () => {
    window.removeEventListener('offline', handleOffline)
    window.removeEventListener('online', handleOnline)
  }

  useEffect(() => {
    setIsOnline(navigator.onLine)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return cleanup
  }, [])

  return { isOnline }
}

export default useOnlineStatus

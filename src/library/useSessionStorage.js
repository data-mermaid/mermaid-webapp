import { useEffect, useState } from 'react'
import usePrevious from './usePrevious'

const useSessionStorage = ({ key, initialValue = undefined, raw = false }) => {
  const getInitialState = () => {
    try {
      const sessionStorageValue = window.sessionStorage.getItem(key)

      if (typeof sessionStorageValue !== 'string') {
        window.sessionStorage.setItem(
          key,
          raw ? String(initialValue) : JSON.stringify(initialValue),
        )

        return initialValue
      }

      return raw ? sessionStorageValue : JSON.parse(sessionStorageValue || 'null')
    } catch {
      // If user is in private mode or has storage restriction sessionStorage can throw.
      // JSON.parse and JSON.stringify can throw, too.
      return initialValue
    }
  }

  const [state, setState] = useState(getInitialState)

  // Track the previous state so we compare it in useEffect
  const previousState = usePrevious(state)

  useEffect(() => {
    try {
      const serializedState = raw ? String(state) : JSON.stringify(state)
      const serializedPreviousState = raw ? String(previousState) : JSON.stringify(previousState)

      if (serializedState !== serializedPreviousState) {
        window.sessionStorage.setItem(key, serializedState)
      }
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. Also JSON.stringify can throw.
    }
  })

  return [state, setState]
}

export default useSessionStorage

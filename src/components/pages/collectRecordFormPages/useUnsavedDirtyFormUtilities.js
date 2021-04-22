import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export const useUnsavedDirtyFormDataUtilities = (sessionStorageName) => {
  const history = useHistory()

  const persistUnsavedFormData = (values) => {
    window.sessionStorage.setItem(sessionStorageName, JSON.stringify(values))
  }

  const clearUnsavedFormData = useCallback(
    () => window.sessionStorage.removeItem(sessionStorageName),
    [sessionStorageName],
  )

  const getUnsavedFormData = () =>
    JSON.parse(window.sessionStorage.getItem(sessionStorageName))

  const _clearUnsavedFormDataBeforeUnload = useEffect(() => {
    window.addEventListener('beforeunload', clearUnsavedFormData)

    return () => {
      window.removeEventListener('beforeunload', clearUnsavedFormData)
    }
  }, [clearUnsavedFormData])

  const _clearUnsavedFormDataBeforeReactRouterChange = useEffect(() => {
    history.listen(() => {
      clearUnsavedFormData()
    })
  }, [history, clearUnsavedFormData])

  return { persistUnsavedFormData, clearUnsavedFormData, getUnsavedFormData }
}

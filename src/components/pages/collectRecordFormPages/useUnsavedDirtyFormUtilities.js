import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export const useUnsavedDirtyFormDataUtilities = (sessionStorageName) => {
  const history = useHistory()

  const persistUnsavedFormData = (values) => {
    window.sessionStorage.setItem(sessionStorageName, JSON.stringify(values))
  }

  const clearPersistedUnsavedFormData = useCallback(
    () => window.sessionStorage.removeItem(sessionStorageName),
    [sessionStorageName],
  )

  const getPersistedUnsavedFormData = () =>
    JSON.parse(window.sessionStorage.getItem(sessionStorageName))

  const _clearPersistedUnsavedFormDataBeforeUnload = useEffect(() => {
    window.addEventListener('beforeunload', clearPersistedUnsavedFormData)

    return () => {
      window.removeEventListener('beforeunload', clearPersistedUnsavedFormData)
    }
  }, [clearPersistedUnsavedFormData])

  const _clearPersistedUnsavedFormDataBeforeReactRouterChange = useEffect(() => {
    history.listen(() => {
      clearPersistedUnsavedFormData()
    })
  }, [history, clearPersistedUnsavedFormData])

  return {
    persistUnsavedFormData,
    clearPersistedUnsavedFormData,
    getPersistedUnsavedFormData,
  }
}

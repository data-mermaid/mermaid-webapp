import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
/**
 * this hook was made so that data a user entered in a form would persist through network status change
 * which causes a rerender because of the way react state via props or context work
 */
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

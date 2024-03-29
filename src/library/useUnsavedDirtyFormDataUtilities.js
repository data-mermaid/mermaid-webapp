import { useCallback, useEffect } from 'react'
import { useRouterFromClearPersistedFormDataHack } from '../App/ClearDirtyFormDataHackContext'
/**
 * this hook was made so that data a user entered in a form would persist through network status change
 * which causes a rerender because of the way react state via props or context work
 */
export const useUnsavedDirtyFormDataUtilities = (sessionStorageName) => {
  const router = useRouterFromClearPersistedFormDataHack()
  const persistUnsavedFormData = useCallback(
    (values) => {
      window.sessionStorage.setItem(sessionStorageName, JSON.stringify(values))
    },
    [sessionStorageName],
  )

  const clearPersistedUnsavedFormData = useCallback(() => {
    window.sessionStorage.removeItem(sessionStorageName)
  }, [sessionStorageName])

  const getPersistedUnsavedFormData = useCallback(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem(sessionStorageName))
    } catch {
      return null
    }
  }, [sessionStorageName])

  const _clearPersistedUnsavedFormDataBeforeUnload = useEffect(() => {
    window.addEventListener('beforeunload', clearPersistedUnsavedFormData)

    return () => {
      window.removeEventListener('beforeunload', clearPersistedUnsavedFormData)
    }
  }, [clearPersistedUnsavedFormData])

  const _clearPersistedUnsavedFormDataBeforeReactRouterChange = useEffect(() => {
    router.subscribe(() => {
      clearPersistedUnsavedFormData()
    })
  }, [clearPersistedUnsavedFormData, router])

  return {
    persistUnsavedFormData,
    clearPersistedUnsavedFormData,
    getPersistedUnsavedFormData,
  }
}

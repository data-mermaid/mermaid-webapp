import { useCallback } from 'react'
import useSessionStorage from '../../../library/useSessionStorage'

/** Custom hook which abstracts some the effort required when dealing with useSessionStorage() for persistent table user preferences */
const useTablePreferencesSessionStorage = (key, defaultValue = undefined) => {
  const [tableUserPreferences, setTableUserPreferences] = useSessionStorage(key, defaultValue)

  /** Update the relevant table user preferences.
   * Only updates user preferences if the value has changed
   */
  const handleSetTableUserPreferences = useCallback((propertyKey, currentValue, previousValue) => {
    const valueChanged =
      JSON.stringify(currentValue) !== JSON.stringify(previousValue)

    if (valueChanged) {
      setTableUserPreferences({
        ...tableUserPreferences,
        [propertyKey]: currentValue
      })
    }
  }, [tableUserPreferences, setTableUserPreferences])

  return [tableUserPreferences, handleSetTableUserPreferences]
}

export default useTablePreferencesSessionStorage

import { useCallback } from 'react'
import useSessionStorage from '../../../library/useSessionStorage'

const usePersistUserTablePreferences = (key, defaultValue = undefined) => {
  // Persist the table user preferences in sessionStorage
  const [tableUserPreferences, setTableUserPreferences] = useSessionStorage(key, defaultValue)

  const handleSetTableUserPreferences = useCallback((propertyKey, currentValue, previousValue) => {
    const valueChanged =
      JSON.stringify(currentValue) !== JSON.stringify(previousValue)

    if (valueChanged) {
      // Update the preference specified in the key
      setTableUserPreferences({
        ...tableUserPreferences,
        [propertyKey]: currentValue
      })
    }
  }, [tableUserPreferences, setTableUserPreferences])

  return [tableUserPreferences, handleSetTableUserPreferences]
}

export default usePersistUserTablePreferences

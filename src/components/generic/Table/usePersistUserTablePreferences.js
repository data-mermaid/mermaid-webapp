import { useCallback } from 'react'
import useSessionStorage from '../../../library/useSessionStorage'
import usePrevious from '../../../library/usePrevious'

const usePersistUserTablePreferences = (key, defaultValue = undefined) => {
  // Persist the table user preferences in sessionStorage
  const [tableUserPreferences, setTableUserPreferences] = useSessionStorage(key, defaultValue)
  // Set the previous value
  const previousPreferences = usePrevious(tableUserPreferences)

  const handleSetTableUserPreferences = useCallback((propertyKey, currentValue) => {
    const previousPreferencesPropExists = previousPreferences
      && Object.prototype.hasOwnProperty.call(previousPreferences, propertyKey)
    const valueChanged = !previousPreferencesPropExists
      || (
        // Current value sometimes set to undefined by useTable after setting it.
        // Do not update preferences when this happens
        currentValue !== undefined
        && JSON.stringify(currentValue) !== JSON.stringify(previousPreferences[propertyKey])
      )

    if (valueChanged) {
      // Update the preference specified in the key
      setTableUserPreferences({
        ...tableUserPreferences,
        [propertyKey]: currentValue || ''
      })
    }
  }, [tableUserPreferences, setTableUserPreferences, previousPreferences])

  return [tableUserPreferences, handleSetTableUserPreferences]
}

export default usePersistUserTablePreferences

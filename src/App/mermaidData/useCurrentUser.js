import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../../language'

export const useCurrentUser = ({ databaseSwitchboardInstance }) => {
  const [currentUser, setCurrentUser] = useState()

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance
        .getUserProfile()
        .then((user) => {
          if (isMounted && user) {
            setCurrentUser(user)
          }
        })
        .catch(() => {
          toast.error(language.error.userProfileUnavailable)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  return currentUser
}

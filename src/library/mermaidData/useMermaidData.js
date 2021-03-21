import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../../language'

export const useMermaidData = ({ mermaidDatabaseGatewayInstance }) => {
  const [currentUser, setCurrentUser] = useState()

  const _initializeUserOnAuthentication = useEffect(() => {
    let isMounted = true

    if (mermaidDatabaseGatewayInstance) {
      mermaidDatabaseGatewayInstance
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
  }, [mermaidDatabaseGatewayInstance])

  return {
    currentUser,
  }
}

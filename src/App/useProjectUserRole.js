import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from '../library/getToastArguments'

export const useProjectUserRole = ({
  currentUser,
  databaseSwitchboardInstance,
  isOfflineStorageHydrated,
}) => {
  const [projectUserRoles, setProjectUserRoles] = useState({})

  const _initializeProjectUserRoles = useEffect(() => {
    let isMounted = true

    const fetchProjectUserRoles = async () => {
      if (databaseSwitchboardInstance && isOfflineStorageHydrated) {
        const projectProfiles = await databaseSwitchboardInstance.getProjectProfiles()

        const filteredProjectProfiles = projectProfiles.filter(
          ({ profile }) => currentUser.id === profile,
        )

        const userProfilesWithProjectRoles = filteredProjectProfiles.map((profile) => {
          const { project, is_admin, is_collector } = profile

          return {
            [project]: { is_admin, is_collector, is_readonly: !is_admin && !is_collector },
          }
        })

        if (isMounted) {
          setProjectUserRoles(userProfilesWithProjectRoles)
        }
      }
    }

    fetchProjectUserRoles().catch(() => {
      toast.error(...getToastArguments(language.error.userProfileUnavailable))
    })

    return () => {
      isMounted = false
    }
  }, [currentUser, databaseSwitchboardInstance, isOfflineStorageHydrated])

  return projectUserRoles
}

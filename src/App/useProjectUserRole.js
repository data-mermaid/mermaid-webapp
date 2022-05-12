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
        const userProfilePromises = []
        const currentUserProfiles = []

        const projects = await databaseSwitchboardInstance.getProjects()

        for (const project of projects) {
          userProfilePromises.push(databaseSwitchboardInstance.getProjectProfiles(project.id))
        }
        const userProfiles = await Promise.all(userProfilePromises)

        for (const userProfile of userProfiles) {
          const filteredUserProfile = userProfile.filter(
            ({ profile }) => currentUser.id === profile,
          )[0]

          currentUserProfiles.push(filteredUserProfile)
        }

        const userProfilesWithProjectRoles = currentUserProfiles.reduce(
          (profileReduced, profile) => {
            if (profile) {
              const { project, is_admin, is_collector } = profile

              return {
                ...profileReduced,
                [project]: { is_admin, is_collector, is_readonly: !is_admin && !is_collector },
              }
            }

            return profileReduced
          },
          {},
        )

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

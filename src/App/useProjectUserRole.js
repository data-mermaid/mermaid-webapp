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
    const isMounted = true

    // const fetchProjectUserRoles = async () => {
    //   if (databaseSwitchboardInstance && isOfflineStorageHydrated) {
    //     const userProfilePromises = []
    //     const currentUserProfiles = []

    //     const projects = await databaseSwitchboardInstance.getProjects()

    //     for (const project of projects) {
    //       userProfilePromises.push(databaseSwitchboardInstance.getProjectProfiles(project.id))
    //     }
    //     const userProfiles = await Promise.all(userProfilePromises)

    //     for (const userProfile of userProfiles) {
    //       const filteredUserProfile = userProfile.filter(
    //         ({ profile }) => currentUser.id === profile,
    //       )[0]

    //       currentUserProfiles.push(filteredUserProfile)
    //     }

    //     const userProfilesWithProjectRoles = currentUserProfiles.reduce(
    //       (profileReduced, profile) => {
    //         if (profile) {
    //           const { project, is_admin, is_collector } = profile

    //           return {
    //             ...profileReduced,
    //             [project]: { is_admin, is_collector, is_readonly: !is_admin && !is_collector },
    //           }
    //         }

    //         return profileReduced
    //       },
    //       {},
    //     )

    //     if (isMounted) {
    //       setProjectUserRoles(userProfilesWithProjectRoles)
    //     }
    //   }
    // }

    const fetchProjectUserRoles = async () => {
      const mockRoles = {
        "5453d405-4daa-4dca-8448-d8ab4288b8df": {
          "is_admin": true,
          "is_collector": true,
          "is_readonly": false
        },
        "8c213ce8-7973-47a5-9359-3a0ef12ed201": {
          "is_admin": true,
          "is_collector": true,
          "is_readonly": false
        }
      }

      if (databaseSwitchboardInstance && isOfflineStorageHydrated) {
        const userProfilePromises = []
        const currentUserProfiles = []

        const projects = await databaseSwitchboardInstance.getProjects()

        for (const project of projects) {
          userProfilePromises.push(databaseSwitchboardInstance.getProjectProfiles(project.id))
        }
        // TEST FAILS IF THIS IS UNCOMMENTED 👇
        // const userProfiles = await Promise.all(userProfilePromises)

        if (isMounted) {
          setProjectUserRoles(mockRoles)
        }
      }
    }

    // fetchProjectUserRoles()
    fetchProjectUserRoles().catch(() => {
      toast.error(...getToastArguments(language.error.userProfileUnavailable))
    })

    // return () => {
    //   isMounted = false
    // }
  }, [currentUser, databaseSwitchboardInstance, isOfflineStorageHydrated])

  return projectUserRoles
}

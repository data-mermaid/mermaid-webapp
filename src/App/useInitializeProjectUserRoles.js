import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from '../library/getToastArguments'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'

const getProjectProfiles = async (dexieInstance, apiBaseUrl, getAccessToken, projectId) => {
  const fetchProjectProfilesApi = async () => {
    return axios
      .get(
        `${apiBaseUrl}/projects/${projectId}/project_profiles/`,
        await getAuthorizationHeaders(getAccessToken),
      )
      .then((profiles) => {
        return profiles.data.results
      })
  }

  return dexieInstance.project_profiles
    .where({ project: projectId })
    .toArray()
    .then(async (result) => {
      const projectProfiles = result.length ? result : await fetchProjectProfilesApi()

      return projectProfiles
    })
}

const getProjects = async (apiBaseUrl, dexieInstance, getAccessToken) => {
  const fetchProjectsApi = async () => {
    return axios
      .get(`${apiBaseUrl}/projects/`, await getAuthorizationHeaders(getAccessToken))
      .then((res) => res.data.results)
  }

  return dexieInstance.projects.toArray().then(async (result) => {
    const projects = result.length ? result : await fetchProjectsApi()

    return projects
  })
}

export const useInitializeProjectUserRoles = ({
  currentUser,
  apiBaseUrl,
  getAccessToken,
  dexieInstance,
  isMermaidAuthenticated,
}) => {
  const [projectUserRoles, setProjectUserRoles] = useState({})

  const _initializeProjectUserRoles = useEffect(() => {
    let isMounted = true

    const fetchProjectUserRoles = async () => {
      if (
        isMermaidAuthenticated &&
        apiBaseUrl &&
        dexieInstance &&
        isMermaidAuthenticated &&
        currentUser
      ) {
        const userProfilePromises = []
        const currentUserProfiles = []

        const projects = await getProjects(apiBaseUrl, dexieInstance, getAccessToken)

        for (const project of projects) {
          userProfilePromises.push(
            getProjectProfiles(dexieInstance, apiBaseUrl, getAccessToken, project.id),
          )
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
            const { project, is_admin, is_collector } = profile

            return { ...profileReduced, [project]: { is_admin, is_collector } }
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
  }, [currentUser, apiBaseUrl, getAccessToken, dexieInstance, isMermaidAuthenticated])

  return projectUserRoles
}

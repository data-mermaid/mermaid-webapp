import axios from 'axios'
import { useEffect, useState } from 'react'
import { getAuthorizationHeaders } from '../library/getAuthorizationHeaders'

const getProjectProfilesOfflineTable = (dexieInstance, projectId) =>
  dexieInstance.project_profiles.where({ project: projectId }).toArray()

const getProjectProfilesAPI = async (apiBaseUrl, projectId, getAccessToken) => {
  return axios
    .get(
      `${apiBaseUrl}/projects/${projectId}/project_profiles/`,
      await getAuthorizationHeaders(getAccessToken),
    )
    .then((profiles) => {
      return profiles.data.results
    })
}

const useInitializeProjectUserRole = ({
  projectId,
  currentUser,
  apiBaseUrl,
  getAccessToken,
  dexieInstance,
  isAppOnline,
}) => {
  const [projectUserRole, setProjectUserRole] = useState()

  useEffect(() => {
    if (!projectId) {
      setProjectUserRole({})
    }

    if (currentUser && projectId && dexieInstance) {
      getProjectProfilesOfflineTable(dexieInstance, projectId).then((result) => {
        const projectProfilesPromise = result.length
          ? dexieInstance.project_profiles.toArray()
          : getProjectProfilesAPI(apiBaseUrl, projectId, getAccessToken)

        projectProfilesPromise.then((profiles) => {
          /* eslint-disable max-nested-callbacks */
          const filteredUserProfile = profiles.filter(
            ({ profile }) => currentUser.id === profile,
          )[0]

          setProjectUserRole(filteredUserProfile)
        })
      })
    }
  }, [isAppOnline, projectId, currentUser, dexieInstance, apiBaseUrl, getAccessToken])

  return projectUserRole
}

export default useInitializeProjectUserRole

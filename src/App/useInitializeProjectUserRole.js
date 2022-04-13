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
  const [isProjectUserRoleLoaded, setIsProjectUserRoleLoaded] = useState(false)

  useEffect(() => {
    if (!projectId) {
      setProjectUserRole({})
      setIsProjectUserRoleLoaded(false)
    }

    if (currentUser && projectId && dexieInstance) {
      getProjectProfilesOfflineTable(dexieInstance, projectId).then(async (result) => {
        const projectProfiles = result.length
          ? result
          : await getProjectProfilesAPI(apiBaseUrl, projectId, getAccessToken)

        const filteredUserProfile = projectProfiles.filter(
          ({ profile }) => currentUser.id === profile,
        )[0]

        setProjectUserRole(filteredUserProfile)
        setIsProjectUserRoleLoaded(true)
      })
    }
  }, [isAppOnline, projectId, currentUser, dexieInstance, apiBaseUrl, getAccessToken])

  return { isProjectUserRoleLoaded, projectUserRole }
}

export default useInitializeProjectUserRole

import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ProjectsMixin = (Base) =>
  class extends Base {
    getOfflineReadyProjectIds = function getOfflineReadyProjectIds() {
      return this._dexiePerUserDataInstance.uiState_offlineReadyProjects.toArray()
    }

    getProjects = function getProjects() {
      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.projects.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProject = function getProject(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.projects.get(id)
    }

    saveProject = async function saveProject({ projectId, editedValues }) {
      if (!projectId || !editedValues) {
        throw new Error('the invocation of saveProject is missing one or more parameters.')
      }

      const projectToEdit = await this.getProject(projectId)
      const editedProject = { ...projectToEdit, ...editedValues, uiState_pushToApi: true }

      return this._dexiePerUserDataInstance.projects.put(editedProject).then(() => {
        return this._apiSyncInstance
          .pushThenPullAllProjectDataExceptChoices(projectId)
          .then((pullResponse) => {
            const editedProjectFromApi = pullResponse.data.projects.updates[0]

            return editedProjectFromApi
          })
      })
    }

    getProjectTags = async function getProjectTags() {
      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projecttags`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data.results)
            .catch(() => Promise.reject(this._notAuthenticatedAndReadyError))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProjectProfiles = function getProjectProfiles(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.project_profiles
            .toArray()
            .then((projectProfiles) =>
              projectProfiles.filter((projectProfile) => projectProfile.project === projectId),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    editProjectProfileRole = async function editProjectProfileRole({
      projectId,
      profileId,
      roleCode,
    }) {
      if (!projectId || !profileId || !roleCode) {
        throw new Error(
          'the invocation of editProjectProfileRole is missing one or more parameters.',
        )
      }
      if (this._isAuthenticatedAndReady) {
        const profileToEdit = await this._dexiePerUserDataInstance.project_profiles
          .toArray()
          .then((projectProfiles) =>
            projectProfiles.find(
              (projectProfile) =>
                projectProfile.project === projectId && projectProfile.id === profileId,
            ),
          )

        const editedProfile = { ...profileToEdit, role: roleCode, uiState_pushToApi: true }

        return this._dexiePerUserDataInstance.project_profiles.put(editedProfile).then(() =>
          this._apiSyncInstance
            .pushThenPullAllProjectDataExceptChoices(projectId)
            .then((pullResponse) => {
              const editedProfileFromApi = pullResponse.data.project_profiles.updates[0]

              return editedProfileFromApi
            }),
        )
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getUserProfile = async function getUserProfile(email) {
      if (!email) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/profiles`, {
              params: {
                email,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((profilesData) => {
              return profilesData
            })
            .catch(() => Promise.reject(this._notAuthenticatedAndReadyError))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addUser = async function addUser(email, projectId) {
      if (!projectId || !email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/add_profile/`,
            {
              email,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    copyProject = async function addProject(originalProjectId, newProjectName, sendEmail) {
      if (!originalProjectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/copy_project/`,
            {
              new_project_name: newProjectName,
              original_project_id: originalProjectId,
              notify_users: sendEmail,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance.pullAllProjects().then((pullResponse) => {
                return pullResponse.data.projects.updates[0]
              })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addProject = async function addProject(newProjectName) {
      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/`,
            {
              name: newProjectName,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance.pullAllProjects().then((pullResponse) => {
                return pullResponse.data.projects.updates[0]
              })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    transferSampleUnits = async function transferSampleUnits(
      projectId,
      fromProfileId,
      toProfileId,
    ) {
      if (!projectId || !fromProfileId || !toProfileId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .put(
            `${this._apiBaseUrl}/projects/${projectId}/transfer_sample_units/`,
            {
              from_profile: fromProfileId,
              to_profile: toProfileId,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    removeUser = async function removeUser(user, projectId) {
      const hasCorrespondingRecordInTheApi = !!user._last_revision_num

      const recordMarkedToBeDeleted = {
        ...user,
        uiStatePush_pushToApi: true,
        _deleted: true,
      }

      if (hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            { project_profiles: [recordMarkedToBeDeleted] },
            {
              params: { force: true },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then(() => {
            return this._apiSyncInstance
              .pushThenPullAllProjectDataExceptChoices(projectId)
              .then((resp) => {
                return resp
              })
          })
      }

      if (!hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_profiles.delete(user.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectsMixin

import axios from 'axios'

const ProjectsMixin = (Base) =>
  class extends Base {
    getOfflineReadyProjectIds = function getOfflineReadyProjectIds() {
      return this._dexieInstance.uiState_offlineReadyProjects.toArray()
    }

    getProjects = function getProjects() {
      return this._isAuthenticatedAndReady
        ? this._dexieInstance.projects.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProject = function getProject(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexieInstance.projects.get(id)
    }

    saveProject = async function saveProject({ projectId, editedValues }) {
      if (!projectId || !editedValues) {
        throw new Error('the invocation of saveProject is missing one or more parameters.')
      }

      const projectToEdit = await this.getProject(projectId)
      const editedProject = { ...projectToEdit, ...editedValues, uiState_pushToApi: true }

      return this._dexieInstance.projects.put(editedProject).then(() => {
        return this._apiSyncInstance
          .pushThenPullEverythingForAProjectButChoices(projectId)
          .then((pullResponse) => {
            const editedProjectFromApi = pullResponse.data.projects.updates[0]

            return editedProjectFromApi
          })
      })
    }

    getProjectTags = function getProjectTags() {
      let token

      this._getAccessToken().then((newToken) => {
        token = newToken
      })

return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/projecttags`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then((apiResults) => apiResults.data.results)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProjectProfiles = function getProjectProfiles(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_profiles
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
        const profileToEdit = await this._dexieInstance.project_profiles
          .toArray()
          .then((projectProfiles) =>
            projectProfiles.find(
              (projectProfile) =>
                projectProfile.project === projectId && projectProfile.id === profileId,
            ),
          )

        const editedProfile = { ...profileToEdit, role: roleCode, uiState_pushToApi: true }

        return this._dexieInstance.project_profiles.put(editedProfile).then(() =>
          this._apiSyncInstance
            .pushThenPullEverythingForAProjectButChoices(projectId)
            .then((pullResponse) => {
              const editedProfileFromApi = pullResponse.data.project_profiles.updates[0]

              return editedProfileFromApi
            }),
        )
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getUserProfile = function getUserProfile(email) {
      if (!email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .get(`${this._apiBaseUrl}/profiles`, {
            params: {
              email,
            },
            headers: {
              Authorization: `Bearer ${this._getAccessToken()}`
            }
          })
          .then((profilesData) => {
            return profilesData
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addUser = function addUser(email, projectId) {
      if (!projectId || !email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        let token

        this._getAccessToken().then((newToken) => {
          token = newToken
        })

        return axios
          .post(`${this._apiBaseUrl}/projects/${projectId}/add_profile/`, {
            email,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(new Error(`'The API status is unsuccessful',`))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    transferSampleUnits = function transferSampleUnits(projectId, fromProfileId, toProfileId) {
      if (!projectId || !fromProfileId || !toProfileId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        let token

        this._getAccessToken().then((newToken) => {
          token = newToken
        })

        return axios
          .put(`${this._apiBaseUrl}/projects/${projectId}/transfer_sample_units/`, {
            from_profile: fromProfileId,
            to_profile: toProfileId,
          }, {
            headers: {
            Authorization: `Bearer ${token}`
          } })
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(new Error(`'The API status is unsuccessful',`))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    removeUser = function removeUser(user, projectId) {
      const hasCorrespondingRecordInTheApi = !!user._last_revision_num

      const recordMarkedToBeDeleted = {
        ...user,
        uiStatePush_pushToApi: true,
        _deleted: true,
      }

      if (hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        let token

        this._getAccessToken().then((newToken) => {
          token = newToken
        })

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            { project_profiles: [recordMarkedToBeDeleted] },
            {
              params: { force: true },
              headers: {
                Authorization: `Bearer ${token}`
              }
            },
          )
          .then(() => {
            return this._apiSyncInstance
              .pushThenPullEverythingForAProjectButChoices(projectId)
              .then((resp) => {
                return resp
              })
          })
      }

      if (!hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        return this._dexieInstance.project_profiles.delete(user.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectsMixin

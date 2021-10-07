const ProjectsMixin = (Base) =>
  class extends Base {
    getOfflineReadyProjectIds = () =>
      this._dexieInstance.uiState_offlineReadyProjects.toArray()

    getProjects = () =>
      this._isAuthenticatedAndReady
        ? this._dexieInstance.projects.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getProject = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexieInstance.projects.get(id)
    }

    getProjectTags = () =>
      this._isOnlineAuthenticatedAndReady
        ? this._authenticatedAxios
            .get(`${this._apiBaseUrl}/projecttags`)
            .then((apiResults) => apiResults.data.results)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getProjectProfiles = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_profiles
            .toArray()
            .then((projectProfiles) =>
              projectProfiles.filter(
                (projectProfile) => projectProfile.project === projectId,
              ),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getUserProfile = (email) => {
      if (!email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return this._authenticatedAxios
          .get(`${this._apiBaseUrl}/profiles`, {
            params: {
              email,
            },
          })
          .then((profilesData) => {
            return profilesData
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addUser = (email, projectId) => {
      if (!projectId || !email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return this._authenticatedAxios
          .post(`${this._apiBaseUrl}/projects/${projectId}/add_profile/`, {
            email,
          })
          .then((response) => {
            const isRecordStatusCodeSuccessful = this._getIsResponseStatusSuccessful(
              response,
            )

            if (isRecordStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(
              new Error(
                `the API record returned from Add User doesn't have a successful status code`,
              ),
            )
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    transferSampleUnits = (projectId, fromProfileId, toProfileId) => {
      if (!projectId || !fromProfileId || !toProfileId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return this._authenticatedAxios
          .put(
            `${this._apiBaseUrl}/projects/${projectId}/transfer_sample_units/`,
            { from_profile: fromProfileId, to_profile: toProfileId },
          )
          .then((response) => {
            const isRecordStatusCodeSuccessful = this._getIsResponseStatusSuccessful(
              response,
            )

            if (isRecordStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(
              new Error(
                `the API record returned from Transfer Sample Units doesn't have a successful status code`,
              ),
            )
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    removeUser = (user, projectId) => {
      console.log('Remove user user', user)
      const hasCorrespondingRecordInTheApi = !!user._last_revision_num

      const recordMarkedToBeDeleted = {
        ...user,
        uiStatePush_pushToApi: true,
        _deleted: true,
      }

      if (
        hasCorrespondingRecordInTheApi &&
        this._isOnlineAuthenticatedAndReady
      ) {
        return this._authenticatedAxios
          .post(
            `${this._apiBaseUrl}/push/`,
            { project_profiles: [recordMarkedToBeDeleted] },
            { params: { force: true } },
          )
          .then(() => {
            return this._apiSyncInstance
              .pushThenPullEverythingForAProjectButChoices(projectId)
              .then((resp) => {
                return resp
              })
          })
      }

      if (
        !hasCorrespondingRecordInTheApi &&
        this._isOnlineAuthenticatedAndReady
      ) {
        return this._dexieInstance.project_profiles.delete(user.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectsMixin

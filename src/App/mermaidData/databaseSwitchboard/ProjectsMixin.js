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
  }

export default ProjectsMixin

const ProjectsMixin = (Base) =>
  class extends Base {
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
            .then((apiResults) => {
              const dataFromApi = apiResults.data.results

              if (!dataFromApi) throw Error('project tags not available')

              return dataFromApi
            })
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

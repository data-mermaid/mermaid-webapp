import mockMermaidData from '../../../testUtilities/mockMermaidData'

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

      return this._isAuthenticatedAndReady
        ? this.getProjects().then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProjectTags = () => {
      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .get(`${this._apiBaseUrl}/projecttags`)
          .then((apiResults) => {
            return apiResults.data.results
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

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

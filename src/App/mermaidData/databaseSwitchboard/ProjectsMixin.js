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

    getProjectTags = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.projecttags)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getProjectProfiles = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.project_profiles)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default ProjectsMixin

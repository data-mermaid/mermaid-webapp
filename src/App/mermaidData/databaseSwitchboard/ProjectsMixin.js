import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ProjectsMixin = (Base) =>
  class extends Base {
    getProjects = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.projects)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default ProjectsMixin

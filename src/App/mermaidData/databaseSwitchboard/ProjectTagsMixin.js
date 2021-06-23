import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ProjectTagsMixin = (Base) =>
  class extends Base {
    getProjectTags = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.projecttags)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default ProjectTagsMixin

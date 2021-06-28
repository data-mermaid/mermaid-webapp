import { getObjectById } from '../../../library/getObjectById'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ProjectsMixin = (Base) =>
  class extends Base {
    getProjects = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.projects)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getProject = (id) =>
      this.getProjects().then((projects) => getObjectById(projects, id))
  }

export default ProjectsMixin

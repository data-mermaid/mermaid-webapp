import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
    getManagementRegimes = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.managementRegimes)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default ManagementRegimesMixin

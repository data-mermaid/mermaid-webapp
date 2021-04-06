import mockMermaidData from '../../../testUtilities/mockMermaidData'

const SitesMixin = (Base) =>
  class extends Base {
    getSites = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.sites)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default SitesMixin

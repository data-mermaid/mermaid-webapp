import mockMermaidData from '../../../testUtilities/mockMermaidData'

const FishNameMixin = (Base) =>
  class extends Base {
    getSpecies = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishSpecies)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default FishNameMixin

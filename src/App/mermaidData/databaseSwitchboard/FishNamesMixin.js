import mockMermaidData from '../../../testUtilities/mockMermaidData'

const FishNameMixin = (Base) =>
  class extends Base {
    getSpecies = () => {
      if (this._isAuthenticatedAndReady) {
        return this._dexieInstance.fishSpecies.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getGenera = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishGenera)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getFamilies = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishFamilies)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default FishNameMixin

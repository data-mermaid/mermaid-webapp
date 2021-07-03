import { createUuid } from '../../../library/createUuid'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const FishNameMixin = (Base) =>
  class extends Base {
    getFishSpecies = () => {
      if (this._isAuthenticatedAndReady) {
        return this._dexieInstance.fishSpecies.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addFishSpecies = ({ genusId, genusName, speciesName }) => {
      const newFishObject = {
        id: createUuid(),
        display_name: `${genusName} ${speciesName}`,
        name: speciesName,
        genus: genusId,
      }

      return this._dexieInstance.fishSpecies
        .put(newFishObject)
        .then(() => newFishObject)
    }

    getFishGenera = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishGenera)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getFishFamilies = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.fishFamilies)
        : Promise.reject(this._notAuthenticatedAndReadyError)
  }

export default FishNameMixin

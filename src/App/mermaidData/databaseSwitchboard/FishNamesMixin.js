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

    addFishSpecies = async ({ genusId, genusName, speciesName }) => {
      if (!genusId || !genusName || !speciesName) {
        Promise.reject(
          new Error('addFishSpecies was implemented with missing parameters'),
        )
      }

      const proposedDisplayName = `${genusName} ${speciesName}`

      const existingSpecies = await this.getFishSpecies()
      const existingMatchingSpecies = existingSpecies.filter(
        (specie) => specie.display_name === proposedDisplayName,
      )
      const isProposedSpeciesAlreadyExisting =
        existingMatchingSpecies.length > 0

      if (isProposedSpeciesAlreadyExisting) {
        const speciesExistsException = {
          message: 'Species already exists',
          existingSpecies: existingMatchingSpecies[0],
        }

        return Promise.reject(speciesExistsException)
      }

      const newFishObject = {
        id: createUuid(),
        display_name: proposedDisplayName,
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

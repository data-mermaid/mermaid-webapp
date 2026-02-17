import { createUuid } from '../../../library/createUuid'

const FishNameMixin = (Base) =>
  class extends Base {
    getFishSpecies = function getFishSpecies() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.fish_species.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addFishSpecies = async function addFishSpecies({ genusId, genusName, speciesName }) {
      if (!genusId || !genusName || !speciesName) {
        Promise.reject(new Error('addFishSpecies was implemented with missing parameters'))
      }

      const proposedDisplayName = `${genusName} ${speciesName}`

      const existingSpecies = await this.getFishSpecies()
      const existingMatchingSpecies = existingSpecies.filter(
        (specie) => specie.display_name === proposedDisplayName,
      )
      const isProposedSpeciesAlreadyExisting = existingMatchingSpecies.length > 0

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
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        const _protectAgainstNetworkStutter = await this._dexiePerUserDataInstance.fish_species.put(
          newFishObject,
        )

        return this._apiSyncInstance
          .pushThenPullFishOrBenthicAttributes('fish_species')
          .then((response) => {
            const newFishSpeciesFromApi = response.data.fish_species.updates[0]

            return newFishSpeciesFromApi
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.fish_species
          .put(newFishObject)
          .then(() => newFishObject)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getFishGenera = function getFishGenera() {
      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.fish_genera.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getFishFamilies = function getFishFamilies() {
      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.fish_families.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getFishGroupings = function getFishGroupings() {
      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.fish_groupings.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default FishNameMixin

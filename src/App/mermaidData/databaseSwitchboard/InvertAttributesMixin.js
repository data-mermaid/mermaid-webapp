import { createUuid } from '../../../library/createUuid'

const InvertAttributesMixin = (Base) =>
  class extends Base {
    // Macroinvertebrates behave the same way as fish:
    // We read from macroinvertebrate attributes and we write to macroinvertebrate species
    getInvertAttributes = function getInvertAttributes() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addInvertSpecies = async function addInvertSpecies({ genusId, genusName, speciesName }) {
      if (!genusId || !genusName || !speciesName) {
        return Promise.reject(new Error('addInvertSpecies was implemented with missing parameters'))
      }

      const existingInvertSpecies = await this.getInvertAttributes()
      const proposedDisplayName = `${genusName} ${speciesName}`

      const existingMatchingSpecies = existingInvertSpecies.filter((attr) => {
        const displayName = attr.display_name ?? attr.name
        return displayName === proposedDisplayName
      })
      const doesProposedSpeciesAlreadyExist = existingMatchingSpecies.length > 0

      if (doesProposedSpeciesAlreadyExist) {
        const speciesExistsException = {
          message: 'Invert species already exists',
          existingSpecies: existingMatchingSpecies[0],
        }

        return Promise.reject(speciesExistsException)
      }

      const newInvertSpeciesObject = {
        id: createUuid(),
        name: speciesName,
        genus: genusId,
        display_name: proposedDisplayName,
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        await this._dexiePerUserDataInstance.invert_attributes.put(newInvertSpeciesObject)

        return this._apiSyncInstance.pushThenPullInvertSpecies().then(async () => {
          const newInvertSpeciesFromDexie =
            await this._dexiePerUserDataInstance.invert_attributes.get(newInvertSpeciesObject.id)

          if (!newInvertSpeciesFromDexie || newInvertSpeciesFromDexie.uiState_pushToApi) {
            return Promise.reject(new Error('Failed to save invert species'))
          }

          return newInvertSpeciesFromDexie
        })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes
          .put(newInvertSpeciesObject)
          .then(() => newInvertSpeciesObject)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default InvertAttributesMixin

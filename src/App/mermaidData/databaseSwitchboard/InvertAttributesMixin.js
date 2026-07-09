import { createUuid } from '../../../library/createUuid'
import { ensureAttributesLoaded } from './ensureAttributesLoaded'

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

    ensureInvertAttributesLoaded = async function ensureInvertAttributesLoaded(attributeIds = []) {
      return ensureAttributesLoaded({
        ids: attributeIds,
        dexieTable: this._dexiePerUserDataInstance.invert_attributes,
        detailUrlById: (id) => `${this._apiBaseUrl}/invertattributes/${id}/`,
        getAccessToken: this._getAccessToken,
        isOnlineAuthenticatedAndReady: this._isOnlineAuthenticatedAndReady,
      })
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
        const _protectAgainstNetworkStutter =
          await this._dexiePerUserDataInstance.invert_attributes.put(newInvertSpeciesObject)

        return this._apiSyncInstance.pushThenPullInvertSpecies().then((response) => {
          const newInvertSpeciesFromApi = response.data.invert_attributes.updates[0]

          return newInvertSpeciesFromApi
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

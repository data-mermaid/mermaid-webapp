import { createUuid } from '../../../library/createUuid'
import { ensureAttributesLoaded } from './ensureAttributesLoaded'

const BenthicAttributesMixin = (Base) =>
  class extends Base {
    getBenthicAttributes = function getBenthicAttributes() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.benthic_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    ensureBenthicAttributesLoaded = async function ensureBenthicAttributesLoaded(
      attributeIds = [],
    ) {
      return ensureAttributesLoaded({
        ids: attributeIds,
        dexieTable: this._dexiePerUserDataInstance.benthic_attributes,
        detailUrlById: (id) => `${this._apiBaseUrl}/benthicattributes/${id}/`,
        getAccessToken: this._getAccessToken,
        isOnlineAuthenticatedAndReady: this._isOnlineAuthenticatedAndReady,
      })
    }

    addBenthicAttribute = async function addBenthicAttribute({
      benthicAttributeParentId,
      benthicAttributeParentName,
      newBenthicAttributeName,
    }) {
      if (!benthicAttributeParentId || !benthicAttributeParentName || !newBenthicAttributeName) {
        return Promise.reject(
          new Error('addBenthicAttribute was implemented with missing parameters'),
        )
      }

      const existingBenthicAttribute = await this.getBenthicAttributes()

      const existingMatchingBenthicAttribute = existingBenthicAttribute.filter(
        (benthicAttribute) => benthicAttribute.name === newBenthicAttributeName,
      )

      const proposedBenthicAttributeExists = existingMatchingBenthicAttribute.length > 0

      if (proposedBenthicAttributeExists) {
        const benthicAttributeException = {
          message: 'Benthic attribute already exists',
          existingBenthicAttribute: existingMatchingBenthicAttribute[0],
        }

        return Promise.reject(benthicAttributeException)
      }

      const parentBenthicAttribute = existingBenthicAttribute.find(
        ({ id }) => id === benthicAttributeParentId,
      )

      // The API derives top_level_category and ignores it on push. Copying the parent's lets an
      // attribute proposed offline group under its category (and count as coral for bleaching)
      // before the next sync replaces it with the API's version.
      const newBenthicAttributeObject = {
        id: createUuid(),
        name: newBenthicAttributeName,
        parent: benthicAttributeParentId,
        top_level_category: parentBenthicAttribute?.top_level_category,
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        const _protectAgainstNetworkStutter =
          await this._dexiePerUserDataInstance.benthic_attributes.put(newBenthicAttributeObject)

        return this._apiSyncInstance
          .pushThenPullAttributes('benthic_attributes')
          .then((response) => {
            const newBenthicAttributeFromApi = response.data.benthic_attributes.updates[0]

            return newBenthicAttributeFromApi
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.benthic_attributes
          .put(newBenthicAttributeObject)
          .then(() => newBenthicAttributeObject)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default BenthicAttributesMixin

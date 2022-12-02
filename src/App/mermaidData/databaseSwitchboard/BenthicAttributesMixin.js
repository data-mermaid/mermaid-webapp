import { createUuid } from '../../../library/createUuid'

const BenthicAttributesMixin = (Base) =>
  class extends Base {
    getBenthicAttributes = function getBenthicAttributes() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.benthic_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addBenthicAttribute = async function addBenthicAttribute({
      benthicAttributeParentId,
      benthicAttributeParentName,
      newBenthicAttributeName,
    }) {
      if (!benthicAttributeParentId || !benthicAttributeParentName || !newBenthicAttributeName) {
        Promise.reject(new Error('addBenthicAttribute was implemented with missing parameters'))
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

      const newBenthicAttributeObject = {
        id: createUuid(),
        name: newBenthicAttributeName,
        parent: benthicAttributeParentId,
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        const _protectAgainstNetworkStutter =
          await this._dexiePerUserDataInstance.benthic_attributes.put(newBenthicAttributeObject)

        return this._apiSyncInstance
          .pushThenPullFishOrBenthicAttributes('benthic_attributes')
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

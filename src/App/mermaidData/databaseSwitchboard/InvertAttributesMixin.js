import { createUuid } from '../../../library/createUuid'

const InvertAttributesMixin = (Base) =>
  class extends Base {
    getInvertAttributes = function getInvertAttributes() {
      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addInvertAttribute = async function addInvertAttribute({
      invertAttributeParentId,
      invertAttributeParentName,
      newInvertAttributeName,
    }) {
      if (!invertAttributeParentId || !invertAttributeParentName || !newInvertAttributeName) {
        return Promise.reject(
          new Error('addInvertAttribute was implemented with missing parameters'),
        )
      }

      const existingInvertAttribute = await this.getInvertAttributes()

      const existingMatchingInvertAttribute = existingInvertAttribute.filter(
        (invertAttribute) => invertAttribute.name === newInvertAttributeName,
      )

      const proposedInvertAttributeExists = existingMatchingInvertAttribute.length > 0

      if (proposedInvertAttributeExists) {
        const invertAttributeException = {
          message: 'Invert attribute already exists',
          existingInvertAttribute: existingMatchingInvertAttribute[0],
        }

        return Promise.reject(invertAttributeException)
      }

      const newInvertAttributeObject = {
        id: createUuid(),
        name: newInvertAttributeName,
        parent: invertAttributeParentId,
        uiState_pushToApi: true,
      }

      if (this._isOnlineAuthenticatedAndReady) {
        const _protectAgainstNetworkStutter =
          await this._dexiePerUserDataInstance.invert_attributes.put(newInvertAttributeObject)

        return this._apiSyncInstance
          .pushThenPullFishOrBenthicAttributes('invert_attributes')
          .then((response) => {
            const newInvertAttributeFromApi = response.data.invert_attributes.updates[0]

            return newInvertAttributeFromApi
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.invert_attributes
          .put(newInvertAttributeObject)
          .then(() => newInvertAttributeObject)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default InvertAttributesMixin

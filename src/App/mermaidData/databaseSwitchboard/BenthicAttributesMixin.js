import { createUuid } from '../../../library/createUuid'
import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import getAttributesInUse from '../getAttributesInUse'

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

    removeInaccessibleAttributes = async function removeInaccessibleAttributes(recordData) {
      if (!this._isAuthenticatedAndReady || !recordData) {
        return Promise.reject(this._notAuthenticatedAndReadyError)
      }

      const attributesInUse = await getAttributesInUse(this._dexiePerUserDataInstance)
      const authHeaders = (await getAuthorizationHeaders(this._getAccessToken)).headers

      // Group attribute IDs used by the current collect record; Sets avoid duplicates.
      const attributesToCheck = {
        benthic_attributes: new Set(),
        fish_species: new Set(),
      }

      recordData.obs_belt_fishes?.forEach((obs) => {
        if (obs.fish_attribute) {
          attributesToCheck.fish_species.add(obs.fish_attribute)
        }
      })
      recordData.obs_benthic_lits?.forEach((obs) => {
        if (obs.attribute) {
          attributesToCheck.benthic_attributes.add(obs.attribute)
        }
      })
      recordData.obs_benthic_pits?.forEach((obs) => {
        if (obs.attribute) {
          attributesToCheck.benthic_attributes.add(obs.attribute)
        }
      })
      recordData.obs_colonies_bleached?.forEach((obs) => {
        if (obs.attribute) {
          attributesToCheck.benthic_attributes.add(obs.attribute)
        }
      })
      recordData.obs_quadrat_benthic_percent?.forEach((obs) => {
        if (obs.attribute) {
          attributesToCheck.benthic_attributes.add(obs.attribute)
        }
      })
      recordData.obs_benthic_photo_quadrats?.forEach((obs) => {
        if (obs.attribute) {
          attributesToCheck.benthic_attributes.add(obs.attribute)
        }
      })

      return Promise.all(
        Object.entries(attributesToCheck).flatMap(([protocol, attributeIds]) => {
          const indexedDbTableToUpdate = this._dexiePerUserDataInstance[protocol]

          return Array.from(attributeIds).map(async (attributeId) => {
            const numTimesAttributeInUse = attributesInUse[protocol][attributeId]

            // If no local records use this attribute anymore, check API accessibility.
            if (!numTimesAttributeInUse) {
              const protocolEndpoint =
                protocol === 'benthic_attributes' ? 'benthicattributes' : 'fishspecies'
              const url = `${this._apiBaseUrl}/${protocolEndpoint}/${attributeId}`
              const response = await axios.get(url, { headers: authHeaders })

              // Status 10 means proposed; remove it from local storage.
              if (response.data.status === 10) {
                await indexedDbTableToUpdate.delete(attributeId)
              }
            }
          })
        }),
      )
    }
  }

export default BenthicAttributesMixin

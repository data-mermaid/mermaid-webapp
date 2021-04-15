import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const CollectRecordsMixin = (Base) =>
  class extends Base {
    #collectRecordProtocolLabels = {
      fishbelt: 'Fish Belt',
      benthiclit: 'Benthic LIT',
      benthicpit: 'Benthic PIT',
      habitatcomplexity: 'Habitat Complexity',
      bleachingqc: 'Bleaching',
    }

    saveFishBelt = (record) => {
      const idToSubmit = record.id ?? createUuid()
      const recordToSubmit = { ...record, id: idToSubmit }

      if (this._isOnlineAuthenticatedAndReady) {
        // upcoming work
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords
          .put(recordToSubmit)
          .then(() => recordToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getFishBelt = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }
      if (this._isOnlineAuthenticatedAndReady) {
        // upcoming work
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords.get(id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteFishBelt = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }
      if (this._isOnlineAuthenticatedAndReady) {
        // upcoming work
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords.delete(id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getCollectRecord = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getCollectRecords().then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getCollectRecords = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.collectRecords)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getCollectRecordsForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getCollectRecords(),
            this.getSites(),
            this.getManagementRegimes(),
          ]).then(([collectRecords, sites, managementRegimes]) => {
            return collectRecords.map((record) => ({
              ...record,
              uiLabels: {
                site: getObjectById(sites, record.data.sample_event.site).name,
                management: getObjectById(
                  managementRegimes,
                  record.data.sample_event.management,
                ).name,
                protocol: this.#collectRecordProtocolLabels[
                  record.data.protocol
                ],
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

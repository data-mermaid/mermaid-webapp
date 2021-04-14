import { createUuid } from '../../../library/createUuid'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const FISH_BELT_TRANSECT_TYPE = 'fishbelt'

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

    getSampleUnitNumber = (data) => {
      let transectNumber

      let labelName

      const { protocol } = data

      if (protocol === FISH_BELT_TRANSECT_TYPE) {
        transectNumber = data?.fishbelt_transect?.number || ''
        labelName = data?.fishbelt_transect?.label || ''
      } else {
        transectNumber = data?.benthic_transect?.number || ''
        labelName = data?.benthic_transect?.label || ''
      }

      if (transectNumber === '') {
        transectNumber = labelName
      } else if (labelName !== '') {
        transectNumber += labelName
      }

      return transectNumber
    }

    getDepth = (data) => {
      let result

      const { protocol } = data

      if (protocol === FISH_BELT_TRANSECT_TYPE) {
        result = data?.fishbelt_transect?.depth || ''
      } else {
        result = data?.benthic_transect?.depth || ''
      }

      return result
    }

    dateFormat = (dateString) => {
      const datePieces = new Date(dateString).toDateString().split(' ')

      // date format DD-MMM-YYYY
      return `${datePieces[2]}-${datePieces[1]}-${datePieces[3]}`
    }

    getObservers = (observers) => {
      return observers
        ? observers
            .reduce((observerList, observer) => {
              // console.log(observerList)
              observerList.push(observer.profile_name)

              return observerList
            }, [])
            .join(', ')
        : ''
    }

    getStatus = (validations) => {
      switch (validations?.status) {
        case 'ok':
          return 'Valid'
        case 'error':
          return 'Errors'
        case 'warning':
          return 'Warnings'
        default:
          return 'Saved'
      }
    }

    getCollectRecordsForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getCollectRecords(),
            this.getSites(),
            this.getManagementRegimes(),
          ]).then(([collectRecords, sites, managementRegimes]) => {
            const getSiteLabel = (searchId) =>
              sites.find((site) => site.id === searchId).name

            const getManagementRegimeLabel = (searchId) =>
              managementRegimes.find((regime) => regime.id === searchId).name

            return collectRecords.map((record) => ({
              ...record,
              uiLabels: {
                site: getSiteLabel(record.data.sample_event.site),
                management: getManagementRegimeLabel(
                  record.data.sample_event.management,
                ),
                protocol: this.#collectRecordProtocolLabels[
                  record.data.protocol
                ],
                sampleUnitNumber: this.getSampleUnitNumber(record.data),
                depth: this.getDepth(record.data),
                sampleDate: this.dateFormat(
                  record.data.sample_event.sample_date,
                ),
                observers: this.getObservers(record.data.observers),
                status: this.getStatus(record.validations),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

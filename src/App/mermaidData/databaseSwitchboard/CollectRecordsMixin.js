import { toast } from 'react-toastify'
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

    #getIsFishBelt = (record) => record.data.protocol === 'fishbelt'

    saveFishBelt = (record) => {
      const idToSubmit = record.id ?? createUuid()
      const recordToSubmit = { ...record, id: idToSubmit }

      if (this._isOnlineAuthenticatedAndReady) {
        toast.error(
          "The online workflow for collect records hasn't been built yet. If you are trying to test the offline workflow, try disabling your internet.",
        )
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

    #getSampleUnit = (record) => {
      const isFishBelt = this.#getIsFishBelt(record)

      const transectNumber = isFishBelt
        ? record.data?.fishbelt_transect?.number
        : record.data?.benthic_transect?.number

      const labelName = isFishBelt
        ? record.data?.fishbelt_transect?.label
        : record.data?.benthic_transect?.label

      const sampleUnit = `${transectNumber ?? ''} ${labelName || ''}`.trim()

      return sampleUnit === '' ? undefined : sampleUnit
    }

    #getDepth = (record) => {
      const isFishBelt = this.#getIsFishBelt(record)

      return isFishBelt
        ? record.data.fishbelt_transect?.depth
        : record.data.benthic_transect?.depth
    }

    #getSampleDateLabel = (record) => {
      const { sample_date } = record.data.sample_event

      if (sample_date) {
        const datePieces = new Date(sample_date).toDateString().split(' ')

        // date format DD-MMM-YYYY as 01-Jan-2010
        return `${datePieces[2]}-${datePieces[1]}-${datePieces[3]}`
      }

      return sample_date
    }

    #getObservers = (record) => {
      const { observers } = record.data

      return observers
        ? observers
            .reduce((observerList, observer) => {
              observerList.push(observer.profile_name)

              return observerList
            }, [])
            .join(', ')
        : ''
    }

    #getStatus = (record) => {
      const { validations } = record

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

    filterChoices = (searchProperty, options) => {
      const rec = options.find((item) => item.id === searchProperty)

      return rec ? rec.name : null
    }

    #getSize = (record, choices) => {
      let result = '-'
      const { belttransectwidths } = choices
      const isFishBelt = this.#getIsFishBelt(record)

      if (isFishBelt) {
        const width = record.data.fishbelt_transect?.width || ''

        const widthFilter = this.filterChoices(width, belttransectwidths.data)

        const length = record.data.fishbelt_transect?.len_surveyed

        if (length && widthFilter) {
          result = `${length}m x ${widthFilter.slice(0, -1)}m`
        } else if (length || width) {
          result = length || widthFilter.slice(0, -1)
        }

        return result
      }
      result = record.data.benthic_transect.len_surveyed || result

      return `${result}m`
    }

    getCollectRecordsForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getCollectRecords(),
            this.getSites(),
            this.getManagementRegimes(),
            this.getChoices(),
          ]).then(([collectRecords, sites, managementRegimes, choices]) => {
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
                size: this.#getSize(record, choices),
                sampleUnitNumber: this.#getSampleUnit(record),
                depth: this.#getDepth(record),
                sampleDate: this.#getSampleDateLabel(record),
                observers: this.#getObservers(record),
                status: this.#getStatus(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

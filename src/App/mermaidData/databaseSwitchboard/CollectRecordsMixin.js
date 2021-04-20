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

    #getSampleUnitLabel = (record) => {
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

    #getDepthLabel = (record) => {
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

      return undefined
    }

    #getObserversLabel = (record) => {
      const { observers } = record.data

      return observers
        ? observers
            .reduce((observerList, observer) => {
              observerList.push(observer.profile_name)

              return observerList
            }, [])
            .join(', ')
        : undefined
    }

    // Nick, if you want to keep the switch, get rid of this #validationTyleLabelObject.
    #validationTypeLabel = {
      ok: 'Valid',
      error: 'Errors',
      warning: 'Warnings',
    }

    // Nick, I left this here for you to decide which approach you want. Parm suggested an object lookup instead of a switch as an approach elsewhere, and I kind of like it. Switches apparently should be avoided, but I dont understand enough about why to be bossy about it.
    // #getStatusLabel = (record) => {
    //   const { validations } = record

    //   switch (validations?.status) {
    //     case 'ok':
    //       return 'Valid'
    //     case 'error':
    //       return 'Errors'
    //     case 'warning':
    //       return 'Warnings'
    //     default:
    //       return 'Saved'
    //   }
    // }

    #getSizeLabel = (record, choices) => {
      const { belttransectwidths } = choices
      const isFishBelt = this.#getIsFishBelt(record)
      const noSizeLabel = '-'

      if (isFishBelt) {
        const widthId = record.data.fishbelt_transect?.width

        const widthNameWithoutUnit = getObjectById(
          belttransectwidths.data,
          widthId,
        )?.name.slice(0, -1)

        const length = record.data.fishbelt_transect?.len_surveyed

        if (length && widthNameWithoutUnit) {
          return `${length}m x ${widthNameWithoutUnit}m`
        }
        if (length || widthNameWithoutUnit) {
          return `${length || widthNameWithoutUnit}m`
        }

        return noSizeLabel
      }

      const length = record.data.benthic_transect.len_surveyed

      return length === undefined ? noSizeLabel : `${length}m`
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
                size: this.#getSizeLabel(record, choices),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                depth: this.#getDepthLabel(record),
                sampleDate: this.#getSampleDateLabel(record),
                observers: this.#getObserversLabel(record),
                status:
                  this.#validationTypeLabel[record.validations?.status] ??
                  'Saved',
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

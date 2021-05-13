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

    #validationTypeLabel = {
      ok: 'Valid',
      error: 'Errors',
      warning: 'Warnings',
    }

    #getIsRecordStatusCodeSuccessful = (recordFromServer) => {
      const statusCode = recordFromServer.status_code

      return statusCode >= 200 && statusCode < 300
    }

    #getIsFishBelt = (record) => record.data.protocol === 'fishbelt'

    #formatFishbeltRecordForPush = ({ record, projectId, profileId }) => {
      const idToSubmit = record.id ?? createUuid()
      const profileIdToSubmit = record.profile ?? profileId
      const projectIdToSubmit = record.project ?? projectId

      return {
        ...record,
        id: idToSubmit,
        data: { ...record.data, protocol: 'fishbelt' },
        project: projectIdToSubmit,
        profile: profileIdToSubmit,
      }
    }

    saveFishBelt = ({ record, profileId, projectId }) => {
      if (!record || !profileId || !projectId) {
        throw new Error(
          'saveFishBelt expects record, profileId, and projectId parameters',
        )
      }
      const recordToSubmit = this.#formatFishbeltRecordForPush({
        record,
        profileId,
        projectId,
      })

      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .post(`${this._apiBaseUrl}/push/`, {
            collect_records: [recordToSubmit],
          })
          .then((response) => {
            const recordFromServer = response.data.collect_records[0]
            const isRecordStatusCodeSuccessful = this.#getIsRecordStatusCodeSuccessful(
              recordFromServer,
            )

            if (isRecordStatusCodeSuccessful) {
              return this._dexieInstance.collectRecords
                .put(recordFromServer)
                .then(() => recordFromServer)
            }

            return Promise.reject(
              new Error(
                'the API record returned from saveFishBelt doesnt have a succussful status code',
              ),
            )
          })
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

    deleteFishBelt = ({ record, profileId, projectId }) => {
      if (!record || !profileId || !projectId) {
        throw new Error(
          'deleteFishBelt expects record, profileId, and projectId parameters',
        )
      }
      if (this._isOnlineAuthenticatedAndReady) {
        const recordMarkedToBeDeleted = {
          ...this.#formatFishbeltRecordForPush({
            record,
            profileId,
            projectId,
          }),
          _deleted: true,
        }

        return this._authenticatedAxios
          .post(`${this._apiBaseUrl}/push/`, {
            collect_records: [recordMarkedToBeDeleted],
          })
          .then((response) => {
            const recordFromServer = response.data.collect_records[0]
            const isRecordStatusCodeSuccessful = this.#getIsRecordStatusCodeSuccessful(
              recordFromServer,
            )

            if (isRecordStatusCodeSuccessful) {
              return this._dexieInstance.collectRecords.delete(record.id)
            }

            return Promise.reject(
              new Error(
                'the API record returned from deleteFishBelt doesnt have a succussful status code',
              ),
            )
          })
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords.delete(record.id)
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

    getCollectRecords = () => {
      if (this._isOnlineAuthenticatedAndReady) {
        toast.warn(
          'When online, this app still uses mock data for the collect record table. To interact with the offline collect edit/create workflow, and see real data, disable your network.',
        )

        return Promise.resolve(mockMermaidData.collectRecords)
      }

      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

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
      const sampleDate = record.data.sample_event.sample_date

      if (!sampleDate) return undefined

      const [year, month, day] = sampleDate.split('-')
      const zeroIndexedMonth = month - 1
      const locale = navigator.language ?? 'en-US'

      return new Date(year, zeroIndexedMonth, day).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
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

    #getStatusLabel = (record) => {
      const { validations } = record

      return this.#validationTypeLabel[validations?.status] ?? 'Saved'
    }

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
                site: getObjectById(sites, record.data.sample_event.site)?.name,
                management: getObjectById(
                  managementRegimes,
                  record.data.sample_event.management,
                )?.name,
                protocol: this.#collectRecordProtocolLabels[
                  record.data.protocol
                ],
                size: this.#getSizeLabel(record, choices),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                depth: this.#getDepthLabel(record),
                sampleDate: this.#getSampleDateLabel(record),
                observers: this.#getObserversLabel(record),
                status: this.#getStatusLabel(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'
import { getSampleDateLabel } from '../getSampleDateLabel'

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

    saveFishBelt = async ({ record, profileId, projectId }) => {
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
        // put it in IDB just in case the network craps out before the API can return
        await this._dexieInstance.collectRecords.put(recordToSubmit)

        return this._authenticatedAxios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              collect_records: [recordToSubmit],
            },
            {
              params: {
                force: true,
              },
            },
          )
          .then((response) => {
            const [recordReturnedFromApiPush] = response.data.collect_records
            const isRecordStatusCodeSuccessful = this.#getIsRecordStatusCodeSuccessful(
              recordReturnedFromApiPush,
            )

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pullApiDataMinimal({ profileId, projectId })
                .then((_dataSetsReturnedFromApiPull) => {
                  return recordReturnedFromApiPush
                })
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

    deleteFishBelt = async ({ record, profileId, projectId }) => {
      if (!record || !profileId || !projectId) {
        throw new Error(
          'deleteFishBelt expects record, profileId, and projectId parameters',
        )
      }
      const hasCorrespondingRecordInTheApi = !!record._last_revision_num

      const recordMarkedToBeDeleted = {
        ...this.#formatFishbeltRecordForPush({
          record,
          profileId,
          projectId,
        }),
        _deleted: true,
      }

      if (
        hasCorrespondingRecordInTheApi &&
        this._isOnlineAuthenticatedAndReady
      ) {
        // put it in IDB just in case the network craps out before the API can return
        await this._dexieInstance.collectRecords.put(recordMarkedToBeDeleted)

        return this._authenticatedAxios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              collect_records: [recordMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
            },
          )
          .then((apiPushResponse) => {
            const recordReturnedFromApiPush =
              apiPushResponse.data.collect_records[0]
            const isRecordStatusCodeSuccessful = this.#getIsRecordStatusCodeSuccessful(
              recordReturnedFromApiPush,
            )

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pullApiDataMinimal({
                  profileId,
                  projectId,
                })
                .then((_apiPullResponse) => apiPushResponse)
            }

            return Promise.reject(
              new Error(
                'the API record returned from deleteFishBelt doesnt have a succussful status code',
              ),
            )
          })
      }
      if (
        hasCorrespondingRecordInTheApi &&
        this._isOfflineAuthenticatedAndReady
      ) {
        return this._dexieInstance.collectRecords.put(recordMarkedToBeDeleted)
      }
      if (
        !hasCorrespondingRecordInTheApi &&
        (this._isOnlineAuthenticatedAndReady ||
          this._isOfflineAuthenticatedAndReady)
      ) {
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
      if (this._isAuthenticatedAndReady) {
        return this._dexieInstance.collectRecords.toArray()
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
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
                sampleDate: getSampleDateLabel(
                  record.data.sample_event.sample_date,
                ),
                observers: this.#getObserversLabel(record),
                status: this.#getStatusLabel(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

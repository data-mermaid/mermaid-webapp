import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'
import getObjectProperty from '../../../library/objects/getObjectProperty'
import setObjectPropertyOnClone from '../../../library/objects/setObjectPropertyOnClone'
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

    #getIsFishBelt = function getIsFishBelt(record) {
      return record?.data?.protocol === 'fishbelt'
    }

    #formatFishbeltRecordForPush = function formatFishbeltRecordForPush({
      record,
      projectId,
      profileId,
    }) {
      const idToSubmit = record.id ?? createUuid()
      const profileIdToSubmit = record.profile ?? profileId
      const projectIdToSubmit = record.project ?? projectId

      return {
        ...record,
        id: idToSubmit,
        data: { ...record.data, protocol: 'fishbelt' },
        project: projectIdToSubmit,
        profile: profileIdToSubmit,
        uiState_pushToApi: true,
      }
    }

    #getSampleUnitLabel = function getSampleUnitLabel(record) {
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

    #getDepthLabel = function getDepthLabel(record) {
      const isFishBelt = this.#getIsFishBelt(record)

      return isFishBelt ? record.data.fishbelt_transect?.depth : record.data.benthic_transect?.depth
    }

    #getObserversLabel = function getObserversLabel(record) {
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

    #getStatusLabel = function getStatusLabel(record) {
      const { validations } = record

      return this.#validationTypeLabel[validations?.status] ?? 'Saved'
    }

    #getSizeLabel = function getSizeLabel(record, choices) {
      const { belttransectwidths } = choices
      const isFishBelt = this.#getIsFishBelt(record)
      const noSizeLabel = '-'

      if (isFishBelt) {
        const widthId = record.data.fishbelt_transect?.width

        const widthNameWithoutUnit = getObjectById(belttransectwidths.data, widthId)?.name.slice(
          0,
          -1,
        )

        const length = record.data.fishbelt_transect?.len_surveyed

        if (length && widthNameWithoutUnit) {
          return `${length}m x ${widthNameWithoutUnit}m`
        }
        if (length || widthNameWithoutUnit) {
          return `${length || widthNameWithoutUnit}m`
        }

        return noSizeLabel
      }

      const length = record.data.benthic_transect?.len_surveyed

      return length === undefined ? noSizeLabel : `${length}m`
    }

    saveFishBelt = async function saveFishBelt({ record, profileId, projectId }) {
      if (!record || !profileId || !projectId) {
        throw new Error('saveFishBelt expects record, profileId, and projectId parameters')
      }
      const recordToSubmit = this.#formatFishbeltRecordForPush({
        record,
        profileId,
        projectId,
      })

      if (this._isOnlineAuthenticatedAndReady) {
        // put it in IDB just in case the network craps out before the API can return
        await this._dexieInstance.collect_records.put(recordToSubmit)

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
            const [recordResponseFromApiPush] = response.data.collect_records
            const isRecordStatusCodeSuccessful =
              this._getIsApiDataItemStatusSuccessful(recordResponseFromApiPush)

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then((_dataSetsReturnedFromApiPull) => {
                  const recordWithExtraPropertiesWrittenByApi = recordResponseFromApiPush.data

                  return recordWithExtraPropertiesWrittenByApi
                })
            }

            return Promise.reject(
              new Error(
                'the API record returned from saveFishBelt doesnt have a successful status code',
              ),
            )
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collect_records.put(recordToSubmit).then(() => recordToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteFishBelt = async function deleteFishBelt({ record, profileId, projectId }) {
      if (!record || !profileId || !projectId) {
        throw new Error('deleteFishBelt expects record, profileId, and projectId parameters')
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

      if (hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        // put it in IDB just in case the network craps out before the API can return
        await this._dexieInstance.collect_records.put(recordMarkedToBeDeleted)

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
            const recordReturnedFromApiPush = apiPushResponse.data.collect_records[0]
            const isRecordStatusCodeSuccessful =
              this._getIsApiDataItemStatusSuccessful(recordReturnedFromApiPush)

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then((_apiPullResponse) => apiPushResponse)
            }

            return Promise.reject(
              new Error(
                'the API record returned from deleteFishBelt doesnt have a successful status code',
              ),
            )
          })
      }
      if (hasCorrespondingRecordInTheApi && this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.collect_records.put(recordMarkedToBeDeleted)
      }
      if (
        !hasCorrespondingRecordInTheApi &&
        (this._isOnlineAuthenticatedAndReady || this._isOfflineAuthenticatedAndReady)
      ) {
        return this._dexieInstance.collect_records.delete(record.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    validateFishBelt = function validateFishbelt({ recordId, projectId }) {
      if (!recordId || !projectId) {
        throw new Error('validateFishBelt expects record, profileId, and projectId parameters')
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .post(`${this._apiBaseUrl}/projects/${projectId}/collectrecords/validate/`, {
            ids: [recordId],
            version: '2',
          })
          .then((response) => {
            const isApiResponseStatusSuccessful =
              this._getDoesApiResponseHaveSuccessfulStatus(response)

            if (isApiResponseStatusSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then((_dataSetsReturnedFromApiPull) => {
                  const validatedData = _dataSetsReturnedFromApiPull.data.collect_records.updates[0]

                  return validatedData
                })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    ignoreRecordLevelValidation = function ignoreRecordLevelValidation({ record, validationId }) {
      if (!record || !validationId) {
        throw new Error('IgnoreRecordLevelValidation requires record and validationId parameters')
      }

      const originalRecordLevelValidations = record.validations.results.$record
      const recordLevelValidationsWithIgnored = originalRecordLevelValidations.map((validation) => {
        if (validation.validation_id === validationId) {
          return { ...validation, status: 'ignore' }
        }

        return validation
      })

      const recordWithIgnoredValidations = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.$record',
        value: recordLevelValidationsWithIgnored,
      })

      return this._dexieInstance.collect_records
        .put(recordWithIgnoredValidations)
        .then(() => recordWithIgnoredValidations)
    }

    ignoreNonObservationFieldValidations = function ignoreNonObservationFieldValidations({
      record,
      validationPath,
    }) {
      if (!record || !validationPath) {
        throw new Error(
          'ignoreNonObservationFieldValidations requires record and validationPath parameters',
        )
      }
      const path = `validations.results.${validationPath}`
      const currentValidations = getObjectProperty({
        object: record,
        path,
      })

      const currentValidationsProperties = Object.keys(currentValidations)

      const ignoredValidations = currentValidationsProperties.map((currentValidationsProperty) => {
        const currentValidationObject = currentValidations[currentValidationsProperty]
        const currentValidationStatus = currentValidationObject.status

        return {
          ...currentValidationObject,
          status: currentValidationStatus === 'warning' ? 'ignore' : currentValidationStatus,
        }
      })

      const recordWithIgnoredValidations = setObjectPropertyOnClone({
        object: record,
        path,
        value: ignoredValidations,
      })

      return this._dexieInstance.collect_records
        .put(recordWithIgnoredValidations)
        .then(() => recordWithIgnoredValidations)
    }

    ignoreObservationValidations = function ignoreObservationValidations({
      record,
      observationUiId,
      observationValidationsCloneWithUuids,
    }) {
      if (!record || !observationUiId) {
        throw new Error(
          'ignoreNonObservationFieldValidations requires record and observationUiId parameters',
        )
      }

      const observationsValidationsWithIgnored = observationValidationsCloneWithUuids.map(
        (observationValidations) => {
          if (observationValidations.observationUiId === observationUiId) {
            return observationValidations.validations.map((validation) => ({
              ...validation,
              status: validation.status === 'warning' ? 'ignore' : validation.status,
            }))
          }

          return observationValidations
        },
      )

      const recordWithIgnoredObservationValidations = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.data.obs_belt_fishes',
        value: observationsValidationsWithIgnored,
      })

      return this._dexieInstance.collect_records
        .put(recordWithIgnoredObservationValidations)
        .then(() => recordWithIgnoredObservationValidations)
    }

    resetRecordLevelValidation = function resetRecordLevelValidation({ record, validationId }) {
      if (!record || !validationId) {
        throw new Error('resetRecordLevelValidation requires record and validationId parameters')
      }

      const originalRecordLevelValidations = record.validations.results.$record
      const recordLevelValidationsWithReset = originalRecordLevelValidations.map((validation) => {
        if (validation.validation_id === validationId) {
          const currentValidationStatus = validation.status

          return {
            ...validation,
            status: currentValidationStatus === 'ignore' ? 'reset' : currentValidationStatus,
          }
        }

        return validation
      })

      const recordWithResetValidation = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.$record',
        value: recordLevelValidationsWithReset,
      })

      return this._dexieInstance.collect_records
        .put(recordWithResetValidation)
        .then(() => recordWithResetValidation)
    }

    resetNonObservationFieldValidations = function resetNonObservationFieldValidations({
      record,
      validationPath,
    }) {
      if (!record || !validationPath) {
        throw new Error(
          'resetNonObservationFieldValidations requires record and validationPath parameters',
        )
      }
      const path = `validations.results.${validationPath}`
      const currentValidations = getObjectProperty({
        object: record,
        path,
      })

      const currentValidationsProperties = Object.keys(currentValidations)

      const resettedValidations = currentValidationsProperties.map((currentValidationsProperty) => {
        const currentValidationObject = currentValidations[currentValidationsProperty]
        const currentValidationStatus = currentValidationObject.status

        return {
          ...currentValidationObject,
          status: currentValidationStatus === 'ignore' ? 'reset' : currentValidationStatus,
        }
      })

      const recordWithResetValidations = setObjectPropertyOnClone({
        object: record,
        path,
        value: resettedValidations,
      })

      return this._dexieInstance.collect_records
        .put(recordWithResetValidations)
        .then(() => recordWithResetValidations)
    }

    resetObservationValidations = function resetObservationValidations({
      record,
      observationUiId,
      observationValidationsCloneWithUuids,
    }) {
      if (!record || !observationUiId) {
        throw new Error(
          'ignoreNonObservationFieldValidations requires record and observationUiId parameters',
        )
      }

      const observationsValidationsWithReset = observationValidationsCloneWithUuids.map(
        (observationValidations) => {
          if (observationValidations.observationUiId === observationUiId) {
            return observationValidations.validations.map((validation) => ({
              ...validation,
              status: validation.status === 'ignore' ? 'reset' : validation.status,
            }))
          }

          return observationValidations
        },
      )

      const recordWithResetObservationValidations = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.data.obs_belt_fishes',
        value: observationsValidationsWithReset,
      })

      return this._dexieInstance.collect_records
        .put(recordWithResetObservationValidations)
        .then(() => recordWithResetObservationValidations)
    }

    getCollectRecord = function getCollectRecord(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexieInstance.collect_records.get(id)
    }

    getCollectRecordsWithoutOfflineDeleted = function getCollectRecordsWithoutOfflineDeleted(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return this._dexieInstance.collect_records
          .toArray()
          .then((records) =>
            records.filter((record) => record.project === projectId && !record._deleted),
          )
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getCollectRecordsForUIDisplay = function getCollectRecordsForUIDisplay(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getCollectRecordsWithoutOfflineDeleted(projectId),
            this.getSitesWithoutOfflineDeleted(projectId),
            this.getManagementRegimesWithoutOfflineDeleted(projectId),
            this.getChoices(),
          ]).then(([collectRecords, sites, managementRegimes, choices]) => {
            return collectRecords.map((record) => ({
              ...record,
              uiLabels: {
                site: getObjectById(sites, record.data.sample_event.site)?.name,
                management: getObjectById(managementRegimes, record.data.sample_event.management)
                  ?.name,
                protocol: this.#collectRecordProtocolLabels[record.data.protocol],
                size: this.#getSizeLabel(record, choices),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                depth: this.#getDepthLabel(record),
                sampleDate: getSampleDateLabel(record.data.sample_event.sample_date),
                observers: this.#getObserversLabel(record),
                status: this.#getStatusLabel(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

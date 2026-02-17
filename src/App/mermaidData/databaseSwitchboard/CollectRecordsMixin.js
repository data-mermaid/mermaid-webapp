import axios from '../../../library/axiosRetry'
import i18next from '../../../../i18n'
import {
  getProtocolTransectType,
  getIsFishBelt,
  getIsQuadratSampleUnit,
  noLabelSymbol,
  getObservationsPropertyNames,
} from '../recordProtocolHelpers'
import { createUuid } from '../../../library/createUuid'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getObjectById } from '../../../library/getObjectById'
import { getSampleDateLabel } from '../getSampleDateLabel'
import getObjectProperty from '../../../library/objects/getObjectProperty'
import setObjectPropertyOnClone from '../../../library/objects/setObjectPropertyOnClone'

const CollectRecordsMixin = (Base) =>
  class extends Base {
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

    #formatCollectRecordForPush = function formatCollectRecordForPush({
      record,
      projectId,
      profileId,
      protocol,
    }) {
      const idToSubmit = record.id ?? createUuid()
      const profileIdToSubmit = record.profile ?? profileId
      const projectIdToSubmit = record.project ?? projectId

      return {
        ...record,
        id: idToSubmit,
        data: { ...record.data, protocol },
        project: projectIdToSubmit,
        profile: profileIdToSubmit,
        uiState_pushToApi: true,
      }
    }

    #getSampleUnitLabel = function getSampleUnitLabel(record) {
      const protocolTransectType = getProtocolTransectType(record.data.protocol)
      const transectNumber = record.data?.[protocolTransectType]?.number
      const labelName = record.data?.[protocolTransectType]?.label

      const sampleUnitLabel = `${transectNumber ?? ''} ${labelName ?? ''}`.trim()

      return sampleUnitLabel
    }

    #getDepthLabel = function getDepthLabel(record) {
      const protocolTransectType = getProtocolTransectType(record.data.protocol)

      return record.data?.[protocolTransectType]?.depth
    }

    #getObserversLabel = function getObserversLabel(record) {
      const { observers } = record.data

      return observers !== undefined && observers.length
        ? observers
            .reduce((observerList, observer) => {
              observerList.push(observer.profile_name)

              return observerList
            }, [])
            .join(', ')
        : noLabelSymbol
    }

    #getStatusLabel = function getStatusLabel(record) {
      const { validations } = record
      const statusKey = validations?.status

      // Map status to translation keys and return translated text
      switch (statusKey) {
        case 'error':
          return i18next.t('sample_units.validation_status.errors')
        case 'warning':
          return i18next.t('sample_units.validation_status.warnings')
        case 'ok':
          return i18next.t('sample_units.validation_status.ready_to_submit')
        default:
          return i18next.t('sample_units.validation_status.saved')
      }
    }

    #getSizeLabel = function getSizeLabel(record, choices) {
      const { belttransectwidths } = choices
      const recordDataProtocol = record?.data?.protocol
      const isFishBelt = getIsFishBelt(recordDataProtocol)
      const isQuadratSampleUnit = getIsQuadratSampleUnit(recordDataProtocol)

      if (isFishBelt) {
        const widthId = record.data?.fishbelt_transect?.width

        const fishBeltWidth = getObjectById(belttransectwidths.data, widthId)?.name.slice(0, -1)

        const fishBeltLength = record.data.fishbelt_transect?.len_surveyed

        if (fishBeltLength && fishBeltWidth) {
          return `${fishBeltLength}m x ${fishBeltWidth}m`
        }

        if (fishBeltLength || fishBeltWidth) {
          return `${fishBeltLength || fishBeltWidth}m`
        }

        return noLabelSymbol
      }

      if (isQuadratSampleUnit) {
        const quadratSize =
          record.data?.quadrat_collection?.quadrat_size ||
          record.data?.quadrat_transect?.quadrat_size

        return quadratSize ? `${quadratSize}m` : noLabelSymbol
      }

      const benthicLength = record.data?.benthic_transect?.len_surveyed

      return benthicLength ? `${benthicLength}m` : noLabelSymbol
    }

    saveSampleUnit = async function saveSampleUnit({ record, profileId, projectId, protocol }) {
      if (!record || !profileId || !projectId || !protocol) {
        throw new Error(
          'saveSampleUnit expects record, profileId, projectId, and protocol parameters',
        )
      }

      const recordToSubmit = this.#formatCollectRecordForPush({
        record,
        profileId,
        projectId,
        protocol,
      })

      if (this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.collect_records.put(recordToSubmit)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            { collect_records: [recordToSubmit] },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [recordResponseFromApiPush] = response.data.collect_records
            const isRecordStatusCodeSuccessful = this._isStatusCodeSuccessful(
              recordResponseFromApiPush.status_code,
            )

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ _pushData, _pullData }) => {
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
        return this._dexiePerUserDataInstance.collect_records
          .put(recordToSubmit)
          .then(() => recordToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
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
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.collect_records.put(recordToSubmit)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              collect_records: [recordToSubmit],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [recordResponseFromApiPush] = response.data.collect_records
            const isRecordStatusCodeSuccessful = this._isStatusCodeSuccessful(
              recordResponseFromApiPush.status_code,
            )

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ _pushData, _pullData }) => {
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
        return this._dexiePerUserDataInstance.collect_records
          .put(recordToSubmit)
          .then(() => recordToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteSampleUnit = async function deleteSampleUnit({ record, profileId, projectId }) {
      if (!record || !profileId || !projectId) {
        throw new Error('deleteSampleUnit expects record, profileId, and projectId parameters')
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
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.collect_records.put(recordMarkedToBeDeleted)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              collect_records: [recordMarkedToBeDeleted],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((apiPushResponse) => {
            const recordReturnedFromApiPush = apiPushResponse.data.collect_records[0]
            const isRecordStatusCodeSuccessful = this._isStatusCodeSuccessful(
              recordReturnedFromApiPush.status_code,
            )

            if (isRecordStatusCodeSuccessful) {
              // do a pull of data related to collect records
              // to make sure it is all updated/deleted in IDB
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ _pushData, _pullData }) => apiPushResponse)
            }

            return Promise.reject(
              new Error(
                'the API record returned from deleteSampleUnit doesnt have a successful status code',
              ),
            )
          })
      }
      if (hasCorrespondingRecordInTheApi && this._isOfflineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.collect_records.put(recordMarkedToBeDeleted)
      }
      if (
        !hasCorrespondingRecordInTheApi &&
        (this._isOnlineAuthenticatedAndReady || this._isOfflineAuthenticatedAndReady)
      ) {
        return this._dexiePerUserDataInstance.collect_records.delete(record.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    validateSampleUnit = async function validateSampleUnit({ recordId, projectId }) {
      if (!recordId || !projectId) {
        throw new Error('validateSampleUnit expects record, profileId, and projectId parameters')
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/collectrecords/validate/`,
            {
              ids: [recordId],
              version: '2',
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseStatusSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseStatusSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ pullData }) => {
                  const validatedData = pullData.data.collect_records.updates[0]

                  return validatedData
                })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    submitSampleUnit = async function submitSampleUnit({ recordId, projectId }) {
      if (!recordId || !projectId) {
        throw new Error('submitSampleUnit expects record, profileId, and projectId parameters')
      }

      if (this._isOnlineAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/collectrecords/submit/`,
            {
              ids: [recordId],
              version: '2',
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseStatusSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseStatusSuccessful) {
              return this._apiSyncInstance.pushThenPullAllProjectDataExceptChoices(projectId)
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

      return this._dexiePerUserDataInstance.collect_records
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
          status:
            currentValidationStatus === 'warning' || currentValidationStatus === 'reset'
              ? 'ignore'
              : currentValidationStatus,
        }
      })

      const recordWithIgnoredValidations = setObjectPropertyOnClone({
        object: record,
        path,
        value: ignoredValidations,
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(recordWithIgnoredValidations)
        .then(() => recordWithIgnoredValidations)
    }

    ignoreObservationValidations = async function ignoreObservationValidations({
      recordId,
      observationId,
    }) {
      if (!recordId || !observationId) {
        throw new Error(
          'ignoreObservationValidations requires recordId and observationId parameters',
        )
      }

      const unmodifiedCollectRecord = await this._dexiePerUserDataInstance.collect_records.get(
        recordId,
      )

      const observationTableNames = getObservationsPropertyNames(unmodifiedCollectRecord)

      let modifiedCollectRegordWithIgnoredObservationValidation = { ...unmodifiedCollectRecord }

      // some records have multiple observation tables, eg: bleaching records
      observationTableNames.forEach((observationTableName) => {
        const observationTable =
          modifiedCollectRegordWithIgnoredObservationValidation.validations.results.data[
            observationTableName
          ]
        const observationsValidationsWithIgnored = observationTable?.map(
          (singleObservationValidations) => {
            return singleObservationValidations.map((validation) => {
              const isValidationBelongingToObservation =
                validation.context?.observation_id === observationId
              const isWarning = validation.status === 'warning'
              const isReset = validation.status === 'reset'

              return {
                ...validation,
                status:
                  isValidationBelongingToObservation && (isWarning || isReset)
                    ? 'ignore'
                    : validation.status,
              }
            })
          },
        )

        const validationPath = `validations.results.data.${observationTableName}`

        modifiedCollectRegordWithIgnoredObservationValidation = setObjectPropertyOnClone({
          object: modifiedCollectRegordWithIgnoredObservationValidation,
          path: validationPath,
          value: observationsValidationsWithIgnored,
        })
      })

      // user form will be dirty, and a save will cause a push to the api
      return this._dexiePerUserDataInstance.collect_records
        .put(modifiedCollectRegordWithIgnoredObservationValidation)
        .then(() => modifiedCollectRegordWithIgnoredObservationValidation)
    }

    resetRecordLevelValidation = function resetRecordLevelValidation({ record, validationId }) {
      if (!record || !validationId) {
        throw new Error('resetRecordLevelValidation requires record and validationId parameters')
      }

      const originalRecordLevelValidations = record.validations.results.$record
      const recordLevelValidationsWithReset = originalRecordLevelValidations.map((validation) => {
        if (validation.validation_id === validationId) {
          return {
            ...validation,
            status: 'reset',
          }
        }

        return validation
      })

      const recordWithResetValidation = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.$record',
        value: recordLevelValidationsWithReset,
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(recordWithResetValidation)
        .then(() => recordWithResetValidation)
    }

    resetNonObservationFieldValidations = async function resetNonObservationFieldValidations({
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

      if (!currentValidations) {
        return record
      }

      const currentValidationsProperties = Object.keys(currentValidations)

      const resettedValidations = currentValidationsProperties.map((currentValidationsProperty) => {
        const currentValidationObject = currentValidations[currentValidationsProperty]

        return {
          ...currentValidationObject,
          status: 'reset',
        }
      })

      const recordWithResetValidations = setObjectPropertyOnClone({
        object: record,
        path,
        value: resettedValidations,
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(recordWithResetValidations)
        .then(() => recordWithResetValidations)
    }

    resetObservationValidations = async function resetObservationValidations({
      recordId,
      observationId,
    }) {
      if (!recordId || !observationId) {
        throw new Error(
          'resetObservationValidations requires recordId and observationId parameters',
        )
      }

      const unmodifiedCollectRecord = await this._dexiePerUserDataInstance.collect_records.get(
        recordId,
      )

      const areThereValidationsToReset = !!unmodifiedCollectRecord?.validations?.results?.data

      if (!areThereValidationsToReset) {
        return unmodifiedCollectRecord
      }

      const observationTableNames = getObservationsPropertyNames(unmodifiedCollectRecord)

      let modifiedCollectRecordWithResetObservationValidations = { ...unmodifiedCollectRecord }

      // some records have multiple observation tables, eg: bleaching records
      observationTableNames.forEach((observationTableName) => {
        const observationTable =
          modifiedCollectRecordWithResetObservationValidations.validations.results.data[
            observationTableName
          ]
        const observationsValidationsWithReset = observationTable.map(
          (singleObservationValidations) => {
            return singleObservationValidations.map((validation) => {
              const isValidationBelongingToObservation =
                validation.context?.observation_id === observationId

              return {
                ...validation,
                status: isValidationBelongingToObservation ? 'reset' : validation.status,
              }
            })
          },
        )

        const validationPath = `validations.results.data.${observationTableName}`

        modifiedCollectRecordWithResetObservationValidations = setObjectPropertyOnClone({
          object: modifiedCollectRecordWithResetObservationValidations,
          path: validationPath,
          value: observationsValidationsWithReset,
        })
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(modifiedCollectRecordWithResetObservationValidations)
        .then(() => modifiedCollectRecordWithResetObservationValidations)
    }

    getCollectRecord = function getCollectRecord(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.collect_records.get(id)
    }

    getCollectRecordsWithoutOfflineDeleted = function getCollectRecordsWithoutOfflineDeleted(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.collect_records
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
                depth: this.#getDepthLabel(record),
                management: getObjectById(managementRegimes, record.data.sample_event.management)
                  ?.name,
                observers: this.#getObserversLabel(record),
                protocol: i18next.t(`protocol_titles.${record.data.protocol}`),
                sampleDate: getSampleDateLabel(record.data.sample_event.sample_date),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                site: getObjectById(sites, record.data.sample_event.site)?.name,
                size: this.#getSizeLabel(record, choices),
                status: this.#getStatusLabel(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

import axios from '../../../library/axiosRetry'
import i18next from '../../../../i18n'
import { VALIDATION_STATUS } from '../../../components/pages/Collect/collectConstants'
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

// A validation result can be changed in three ways, all written back by the mappers in the
// mixin. Only a warning can be ignored, so un-ignoring turns it back into one.
const matchesValidationId = (validation, validationId) =>
  !validationId || validation.validation_id === validationId

const isOnObservation = (validation, observationId) =>
  (validation.context?.observation_id ?? validation.context?.id) === observationId

const toIgnored = (validation) => {
  const ignored = { ...validation, status: 'ignore' }

  delete ignored.isStale

  return ignored
}

// A warning restored on an edited field or row is as stale as its neighbours: the value it
// judged has changed too.
const toWarning = (validation, siblings) => {
  const warning = { ...validation, status: 'warning' }

  if (siblings.some((sibling) => sibling.isStale)) {
    warning.isStale = true
  }

  return warning
}

// Editing greys a field's or row's errors and warnings until the next Validate. An ignored
// warning was the diver's call about the record, not a finding about the value, so it stays.
const toStale = (validation) =>
  validation.status === 'error' || validation.status === 'warning'
    ? { ...validation, isStale: true }
    : validation

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

    // Normalise the raw validation status to a stable key used for both the
    // translated label and the status border colour. Anything without an
    // error/warning/ok status (including offline records with no validation
    // status yet) is treated as 'stale'.
    #getStatusValue = function getStatusValue(record) {
      const statusKey = record.validations?.status

      switch (statusKey) {
        case 'error':
        case 'warning':
        case 'ok':
          return statusKey
        default:
          return 'stale'
      }
    }

    #getStatusLabel = function getStatusLabel(record) {
      // Map the stable status value to translation keys and return translated text
      switch (this.#getStatusValue(record)) {
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

      // The API marks validations stale on every save. The IDB copy is marked stale too, so a
      // record whose save hasn't reached the API yet doesn't read its last result as current.
      const recordForOfflineStorage = recordToSubmit.validations
        ? {
            ...recordToSubmit,
            validations: { ...recordToSubmit.validations, status: VALIDATION_STATUS.stale },
          }
        : recordToSubmit

      if (this._isOnlineAuthenticatedAndReady) {
        // Add to IDB in case the there are network issues before the API responds
        await this._dexiePerUserDataInstance.collect_records.put(recordForOfflineStorage)

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
          .put(recordForOfflineStorage)
          .then(() => recordForOfflineStorage)
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

    // The API re-validates each record before writing it and skips any that fail, but it replies
    // HTTP 200 either way, keyed by record id: { [recordId]: { status: 'ok' | 'error', record } }.
    // The record on an error result carries the fresh validations. Resolves with
    // { isSubmitted, record }; rejects only when the request itself fails.
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

            if (!isApiResponseStatusSuccessful) {
              return Promise.reject(new Error('The API status is unsuccessful'))
            }

            const submitResult = response.data?.[recordId]

            // Pull after a rejection too: the API has already saved the record's new validations.
            return this._apiSyncInstance
              .pushThenPullAllProjectDataExceptChoices(projectId)
              .then(() => ({
                isSubmitted: submitResult?.status === 'ok',
                record: submitResult?.record,
              }))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    // Every change to a stored validation result goes through one of the three mappers below,
    // which apply `mapValidation` to each result on the record level, on one field, or on one
    // observation row, then store the record. A save pushes it.
    _mapRecordLevelValidations = function _mapRecordLevelValidations(record, mapValidation) {
      const updatedRecord = setObjectPropertyOnClone({
        object: record,
        path: 'validations.results.$record',
        value: record.validations.results.$record.map(mapValidation),
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(updatedRecord)
        .then(() => updatedRecord)
    }

    _mapFieldValidations = function _mapFieldValidations(record, validationPath, mapValidation) {
      const path = `validations.results.${validationPath}`
      const fieldValidations = getObjectProperty({ object: record, path })

      if (!fieldValidations) {
        return Promise.resolve(record)
      }

      // The API keys a field's results by validator name; they are stored back as an array.
      const siblings = Object.values(fieldValidations)
      const updatedRecord = setObjectPropertyOnClone({
        object: record,
        path,
        value: siblings.map((validation) => mapValidation(validation, siblings)),
      })

      return this._dexiePerUserDataInstance.collect_records
        .put(updatedRecord)
        .then(() => updatedRecord)
    }

    _mapObservationValidations = async function _mapObservationValidations(
      recordId,
      observationId,
      mapValidation,
    ) {
      const record = await this._dexiePerUserDataInstance.collect_records.get(recordId)

      if (!record?.validations?.results?.data) {
        return record
      }

      // Bleaching has two observation tables, and a table can have no results yet.
      const updatedRecord = getObservationsPropertyNames(record).reduce((updated, tableName) => {
        const path = `validations.results.data.${tableName}`
        const table = getObjectProperty({ object: updated, path })

        if (!table) {
          return updated
        }

        return setObjectPropertyOnClone({
          object: updated,
          path,
          value: table.map((rowValidations) =>
            rowValidations.map((validation) =>
              isOnObservation(validation, observationId)
                ? mapValidation(validation, rowValidations)
                : validation,
            ),
          ),
        })
      }, record)

      return this._dexiePerUserDataInstance.collect_records
        .put(updatedRecord)
        .then(() => updatedRecord)
    }

    ignoreRecordLevelValidation = function ignoreRecordLevelValidation({ record, validationId }) {
      if (!record || !validationId) {
        throw new Error('ignoreRecordLevelValidation requires record and validationId parameters')
      }

      return this._mapRecordLevelValidations(record, (validation) =>
        validation.validation_id === validationId ? toIgnored(validation) : validation,
      )
    }

    unignoreRecordLevelValidation = function unignoreRecordLevelValidation({
      record,
      validationId,
    }) {
      if (!record || !validationId) {
        throw new Error('unignoreRecordLevelValidation requires record and validationId parameters')
      }

      return this._mapRecordLevelValidations(record, (validation) =>
        validation.validation_id === validationId ? toWarning(validation, []) : validation,
      )
    }

    // Without a validationId, the field functions act on every warning on the field.
    ignoreNonObservationFieldValidations = function ignoreNonObservationFieldValidations({
      record,
      validationPath,
      validationId,
    }) {
      if (!record || !validationPath) {
        throw new Error(
          'ignoreNonObservationFieldValidations requires record and validationPath parameters',
        )
      }

      return this._mapFieldValidations(record, validationPath, (validation) =>
        validation.status === 'warning' && matchesValidationId(validation, validationId)
          ? toIgnored(validation)
          : validation,
      )
    }

    unignoreNonObservationFieldValidations = function unignoreNonObservationFieldValidations({
      record,
      validationPath,
      validationId,
    }) {
      if (!record || !validationPath) {
        throw new Error(
          'unignoreNonObservationFieldValidations requires record and validationPath parameters',
        )
      }

      return this._mapFieldValidations(record, validationPath, (validation, siblings) =>
        validation.status === 'ignore' && matchesValidationId(validation, validationId)
          ? toWarning(validation, siblings)
          : validation,
      )
    }

    markFieldValidationsStale = function markFieldValidationsStale({ record, validationPath }) {
      if (!record || !validationPath) {
        throw new Error('markFieldValidationsStale requires record and validationPath parameters')
      }

      return this._mapFieldValidations(record, validationPath, toStale)
    }

    ignoreObservationValidations = function ignoreObservationValidations({
      recordId,
      observationId,
      validationId,
    }) {
      if (!recordId || !observationId) {
        throw new Error(
          'ignoreObservationValidations requires recordId and observationId parameters',
        )
      }

      return this._mapObservationValidations(recordId, observationId, (validation) =>
        validation.status === 'warning' && matchesValidationId(validation, validationId)
          ? toIgnored(validation)
          : validation,
      )
    }

    unignoreObservationValidations = function unignoreObservationValidations({
      recordId,
      observationId,
      validationId,
    }) {
      if (!recordId || !observationId) {
        throw new Error(
          'unignoreObservationValidations requires recordId and observationId parameters',
        )
      }

      return this._mapObservationValidations(recordId, observationId, (validation, siblings) =>
        validation.status === 'ignore' && matchesValidationId(validation, validationId)
          ? toWarning(validation, siblings)
          : validation,
      )
    }

    markObservationValidationsStale = function markObservationValidationsStale({
      recordId,
      observationId,
    }) {
      if (!recordId || !observationId) {
        throw new Error(
          'markObservationValidationsStale requires recordId and observationId parameters',
        )
      }

      return this._mapObservationValidations(recordId, observationId, toStale)
    }

    markCollectRecordValidationsStale = async function markCollectRecordValidationsStale(recordId) {
      if (!recordId) {
        throw new Error('markCollectRecordValidationsStale requires a recordId parameter')
      }
      const record = await this._dexiePerUserDataInstance.collect_records.get(recordId)
      if (!record?.validations) {
        return record
      }
      const updatedRecord = {
        ...record,
        validations: { ...record.validations, status: VALIDATION_STATUS.stale },
      }
      return this._dexiePerUserDataInstance.collect_records
        .put(updatedRecord)
        .then(() => updatedRecord)
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
                statusValue: this.#getStatusValue(record),
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default CollectRecordsMixin

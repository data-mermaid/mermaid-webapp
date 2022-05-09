import axios from 'axios'
import { getSampleDateLabel } from '../getSampleDateLabel'
import { getRecordProtocolLabel } from '../getRecordProtocolLabel'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const SubmittedRecordsMixin = (Base) =>
  class extends Base {
    #getSampleUnitLabel = function getSampleUnitLabel(record) {
      const sampleUnit = `${record.sample_unit_number ?? ''} ${record.label ?? ''}`.trim()

      return sampleUnit === '' ? undefined : sampleUnit
    }

    #getMethodLabel = function getMethodLabel(protocol, recordLabel) {
      if (recordLabel.length) {
        return `${getRecordProtocolLabel(protocol)} ${recordLabel}`
      }

      return getRecordProtocolLabel(protocol)
    }

    #toFindDuplicates = function toFindDuplicates(array) {
      return new Set(array).size !== array.length
    }

    #removeDateFromName = function removeDateFromName(name) {
      const names = name.split(' ')

      if (names.length > 1) {
        names.splice(-1, 1)

        return names
      }

      return names[0]
    }

    #populateAdditionalSites = function populateAdditionalSites(siteRecords) {
      const allMethods = siteRecords.map((record) => record.transect_protocol)
      const uniqueMethods = [...new Set(allMethods)]
      const uniqueTransectAndMethods = uniqueMethods.map((method) => {
        return {
          transectMethod: method,
          protocolLabel: getRecordProtocolLabel(method),
        }
      })

      const siteRecordMemory = siteRecords.reduce((acc, record) => {
        acc[record.site] = acc[record.site] || {}
        acc[record.site] = {
          site_name: record.site_name,
          transects: acc[record.site].transects
            ? acc[record.site].transects.concat(record.transect_protocol)
            : [record.transect_protocol],
          methods: acc[record.site].methods
            ? acc[record.site].methods.concat(record.method)
            : [record.method],
        }

        return acc
      }, {})

      for (const siteId in siteRecordMemory) {
        if (Object.prototype.hasOwnProperty.call(siteRecordMemory, siteId)) {
          /* eslint max-depth: ["error", 4]*/
          for (const missingTransect of uniqueTransectAndMethods) {
            if (
              !(
                siteRecordMemory[siteId].methods.includes(missingTransect.protocolLabel) &&
                siteRecordMemory[siteId].transects.includes(missingTransect.transectMethod)
              )
            ) {
              siteRecords.push({
                site: siteId,
                site_name: this.#removeDateFromName(siteRecordMemory[siteId].site_name),
                method: missingTransect.protocolLabel,
                transect_protocol: missingTransect.transectMethod,
                sample_unit_numbers: [],
              })
            }
          }
        }
      }

      return siteRecords
    }

    getSubmittedRecords = async function getSubmittedRecords(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/projects/${projectId}/sampleunitmethods/`, {
              params: {
                protocol: `fishbelt,benthiclit,benthicpit,habitatcomplexity,bleachingqc`,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data.results)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedFishBeltTransectRecord = async function getSubmittedFishBeltTransectRecord(
      projectId,
      id,
    ) {
      if (!(id || projectId)) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${id}`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecordsForUIDisplay = function getSubmittedRecordsForUIDisplay(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecords(projectId).then((submittedRecords) => {
            return submittedRecords.map((record) => ({
              ...record,
              uiLabels: {
                depth: record.depth,
                management: record.management_name,
                observers: record.observers.join(', '),
                protocol: getRecordProtocolLabel(record.protocol),
                sampleDate: getSampleDateLabel(record.sample_date),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                site: record.site_name,
                size: record.size_display,
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getRecordsForUsersAndTransectsTable = function getRecordsForUsersAndTransectsTable(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSubmittedRecords(projectId).then((submittedRecords) => {
            const sampleEventUnitRecords = []
            const filteredSubmittedRecords = submittedRecords.filter(
              (record) => record.protocol !== 'bleachingqc',
            )

            const sampleEventRecordsGroupedBySite = filteredSubmittedRecords.reduce(
              (accumulator, record) => {
                const { id, site, site_name, protocol, sample_unit_number, label, sample_date } =
                  record

                const siteInfo = { site, site_name }

                accumulator[site] = accumulator[site] || {}
                accumulator[site][`${protocol}${label}`] =
                  accumulator[site][`${protocol}${label}`] || {}

                accumulator[site][`${protocol}${label}`] = {
                  ...siteInfo,
                  transect_protocol: protocol,
                  method: this.#getMethodLabel(protocol, label),
                  sample_unit_numbers: accumulator[site][`${protocol}${label}`].sample_unit_numbers
                    ? accumulator[site][`${protocol}${label}`].sample_unit_numbers.concat({
                        id,
                        sample_unit_number,
                        sample_date,
                      })
                    : [{ id, sample_unit_number, sample_date }],
                }

                return accumulator
              },
              {},
            )

            for (const siteId in sampleEventRecordsGroupedBySite) {
              if (Object.prototype.hasOwnProperty.call(sampleEventRecordsGroupedBySite, siteId)) {
                const siteRecordGroup = Object.values(sampleEventRecordsGroupedBySite[siteId])

                for (const siteRecord of siteRecordGroup) {
                  const { sample_unit_numbers } = siteRecord
                  const sampleUnitNumbers = sample_unit_numbers.map(
                    ({ sample_unit_number }) => sample_unit_number,
                  )
                  const sampleDates = sample_unit_numbers.map(({ sample_date }) => sample_date)

                  const hasDuplicateTransectNumbersInSampleUnit =
                    this.#toFindDuplicates(sampleUnitNumbers)
                  const hasMoreThanOneSampleDatesInSampleUnit = new Set(sampleDates).size > 1

                  if (
                    hasDuplicateTransectNumbersInSampleUnit &&
                    hasMoreThanOneSampleDatesInSampleUnit
                  ) {
                    const sampleUnitNumbersGroupedBySampleDate = sample_unit_numbers.reduce(
                      (acc, sampleUnit) => {
                        acc[sampleUnit.sample_date] = acc[sampleUnit.sample_date] || []
                        acc[sampleUnit.sample_date].push(sampleUnit)

                        return acc
                      },
                      {},
                    )

                    for (const sampleDateUnit in sampleUnitNumbersGroupedBySampleDate) {
                      /* eslint max-depth: ["error", 6]*/
                      if (
                        Object.prototype.hasOwnProperty.call(
                          sampleUnitNumbersGroupedBySampleDate,
                          sampleDateUnit,
                        )
                      ) {
                        sampleEventUnitRecords.push({
                          ...siteRecord,
                          site_name: `${siteRecord.site_name} ${sampleDateUnit}`,
                          sample_unit_numbers: sampleUnitNumbersGroupedBySampleDate[sampleDateUnit],
                        })
                      }
                    }
                  } else {
                    sampleEventUnitRecords.push(siteRecord)
                  }
                }
              }
            }

            this.#populateAdditionalSites(sampleEventUnitRecords)

            return sampleEventUnitRecords
          }, {})
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    moveToCollect = async function moveToCollect({ projectId, submittedRecordId }) {
      if (!projectId || !submittedRecordId) {
        Promise.reject(
          new Error(
            'The function, moveToCollect requires an object parameter with projectId and submittedRecordId properties',
          ),
        )
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .put(
              `${this._apiBaseUrl}/projects/${projectId}/beltfishtransectmethods/${submittedRecordId}/edit/`,
              {},
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then(() =>
              this._apiSyncInstance.pushThenPullEverythingForAProjectButChoices(projectId),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    exportToCSV = async function exportToCSV(projectId, protocol, method) {
      const token = await this._getAccessToken()

      const report_url = `${this._apiBaseUrl}/projects/${projectId}/${protocol}/${method}/csv/?field_report=true&access_token=${token}`

      window.open(report_url)
    }
  }

export default SubmittedRecordsMixin

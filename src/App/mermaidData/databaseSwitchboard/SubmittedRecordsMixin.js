import axios from 'axios'
import moment from 'moment'
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
      const isDateInNames = moment(names[names.length - 1], 'YYYY-MM-DD', true).isValid()

      if (names.length > 1) {
        if (isDateInNames) {
          names.splice(-1, 1)

          return names
        }

        return names.join(' ')
      }

      return names[0]
    }

    #groupSampleUnitNumbersBySampleDate = function groupSampleUnitNumbersBySampleDate(
      sampleUnitNumbers,
    ) {
      return sampleUnitNumbers.reduce((accumulator, sampleUnit) => {
        accumulator[sampleUnit.sample_date] = accumulator[sampleUnit.sample_date] || []
        accumulator[sampleUnit.sample_date].push(sampleUnit)

        return accumulator
      }, {})
    }

    #groupSampleEventRecordsBySiteThenMethodAndLabel =
      function groupSampleEventRecordsBySiteThenMethodAndLabel(sampleEventUnitRecords) {
        /* Rule: Group sample units by Site then Method + label. */
        return sampleEventUnitRecords.reduce((accumulator, record) => {
          const { id, site, site_name, protocol, sample_unit_number, label, sample_date } = record

          const siteInfo = { site, site_name }

          accumulator[site] = accumulator[site] || {}
          accumulator[site][`${protocol}${label}`] = accumulator[site][`${protocol}${label}`] || {}

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
        }, {})
      }

    #populateAdditionalRecords = function populateAdditionalRecords(sampleEventUnitRecords) {
      /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity, but it's given it's own row in every site row */
      const allMethods = sampleEventUnitRecords.map((record) => record.transect_protocol)
      const uniqueMethods = [...new Set(allMethods)]
      const uniqueTransectAndMethods = uniqueMethods.map((method) => {
        return {
          method,
          protocol: getRecordProtocolLabel(method),
        }
      })

      const recordGroupedBySite = sampleEventUnitRecords.reduce((accumulator, record) => {
        accumulator[record.site] = accumulator[record.site] || {}
        accumulator[record.site] = {
          site_name: record.site_name,
          transects: accumulator[record.site].transects
            ? accumulator[record.site].transects.concat(record.transect_protocol)
            : [record.transect_protocol],
          methods: accumulator[record.site].methods
            ? accumulator[record.site].methods.concat(record.method)
            : [record.method],
        }

        return accumulator
      }, {})

      for (const siteId in recordGroupedBySite) {
        if (Object.prototype.hasOwnProperty.call(recordGroupedBySite, siteId)) {
          /* eslint max-depth: ["error", 4]*/
          for (const missingTransect of uniqueTransectAndMethods) {
            if (
              !(
                recordGroupedBySite[siteId].methods.includes(missingTransect.protocol) &&
                recordGroupedBySite[siteId].transects.includes(missingTransect.method)
              )
            ) {
              const siteName = this.#removeDateFromName(recordGroupedBySite[siteId].site_name)

              sampleEventUnitRecords.push({
                site: siteId,
                site_name: siteName,
                method: missingTransect.protocol,
                transect_protocol: missingTransect.method,
                sample_unit_numbers: [],
              })
            }
          }
        }
      }

      return sampleEventUnitRecords
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
                limit: 1000,
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

            const sampleEventRecordsGroup =
              this.#groupSampleEventRecordsBySiteThenMethodAndLabel(filteredSubmittedRecords)

            for (const siteId in sampleEventRecordsGroup) {
              if (Object.prototype.hasOwnProperty.call(sampleEventRecordsGroup, siteId)) {
                const siteRecordGroup = Object.values(sampleEventRecordsGroup[siteId])

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
                    // rules: If there's more than one sample event at a site in a project, show the date of the sample event in it's own "site row"
                    const sampleUnitNumbersGroup =
                      this.#groupSampleUnitNumbersBySampleDate(sample_unit_numbers)

                    for (const sampleDateUnit in sampleUnitNumbersGroup) {
                      /* eslint max-depth: ["error", 6]*/
                      if (
                        Object.prototype.hasOwnProperty.call(sampleUnitNumbersGroup, sampleDateUnit)
                      ) {
                        sampleEventUnitRecords.push({
                          ...siteRecord,
                          site_name: `${siteRecord.site_name} ${sampleDateUnit}`,
                          sample_unit_numbers: sampleUnitNumbersGroup[sampleDateUnit],
                        })
                      }
                    }
                  } else {
                    sampleEventUnitRecords.push(siteRecord)
                  }
                }
              }
            }
            this.#populateAdditionalRecords(sampleEventUnitRecords)

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

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
            const result = []
            const recordsGroupedBySite = submittedRecords.reduce((accumulator, record) => {
              const { site, site_name, protocol, sample_unit_number } = record
              const siteInfo = { site, site_name }
              const isFishBelt = protocol === 'fishbelt'
              const isBenthicPIT = protocol === 'benthicpit'
              const isBenthicLIT = protocol === 'benthiclit'
              const isHabitatComplexity = protocol === 'habitatcomplexity'
              const isBleaching = protocol === 'bleachingqc'

              if (!accumulator[site]) {
                return {
                  ...accumulator,
                  [site]: {
                    fishbelts: {
                      ...siteInfo,
                      method: 'Fish Belt',
                      numbers: isFishBelt ? [sample_unit_number] : [],
                    },
                    benthicpits: {
                      ...siteInfo,
                      method: 'Benthic Pit',
                      numbers: isBenthicPIT ? [sample_unit_number] : [],
                    },
                    benthiclits: {
                      ...siteInfo,
                      method: 'Benthic Lit',
                      numbers: isBenthicLIT ? [sample_unit_number] : [],
                    },
                    habitatcomplexities: {
                      ...siteInfo,
                      method: 'Habitat Complexity',
                      numbers: isHabitatComplexity ? [sample_unit_number] : [],
                    },
                    bleachingqcs: {
                      ...siteInfo,
                      method: 'Bleaching',
                      numbers: isBleaching ? [sample_unit_number] : [],
                    },
                  },
                }
              }

              if (isFishBelt) {
                accumulator[site].fishbelts.numbers.push(sample_unit_number)
              }
              if (isBenthicPIT) {
                accumulator[site].benthicpits.numbers.push(sample_unit_number)
              }
              if (isBenthicLIT) {
                accumulator[site].benthiclits.numbers.push(sample_unit_number)
              }
              if (isHabitatComplexity) {
                accumulator[site].habitatcomplexities.numbers.push(sample_unit_number)
              }
              if (isBleaching) {
                accumulator[site].bleachingqcs.numbers.push(sample_unit_number)
              }

              return accumulator
            }, {})

            for (const siteId in recordsGroupedBySite) {
              if (Object.prototype.hasOwnProperty.call(recordsGroupedBySite, siteId)) {
                if (recordsGroupedBySite[siteId].fishbelts.numbers.length) {
                  result.push(recordsGroupedBySite[siteId].fishbelts)
                }
                if (recordsGroupedBySite[siteId].benthicpits.numbers.length) {
                  result.push(recordsGroupedBySite[siteId].benthicpits)
                }
                if (recordsGroupedBySite[siteId].benthiclits.numbers.length) {
                  result.push(recordsGroupedBySite[siteId].benthiclits)
                }
              }
            }

            return result
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

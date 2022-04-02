import axios from 'axios'
import { getSampleDateLabel } from '../getSampleDateLabel'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const SubmittedRecordsMixin = (Base) =>
  class extends Base {
    #submittedRecordProtocolLabels = {
      fishbelt: 'Fish Belt',
      benthiclit: 'Benthic LIT',
      benthicpit: 'Benthic PIT',
      habitatcomplexity: 'Habitat Complexity',
      bleachingqc: 'Bleaching',
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
                protocol: this.#submittedRecordProtocolLabels[record.protocol],
                site: record.site_name,
                management: record.management_name,
                sampleUnitNumber: record.sample_unit_number,
                size: record.size_display,
                depth: record.depth,
                sampleDate: getSampleDateLabel(record.sample_date),
                observers: record.observers.join(', '),
              },
            }))
          })
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

import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getProtocolMethodsType } from '../recordProtocolHelpers'
import { getSampleDateLabel } from '../getSampleDateLabel'
import axios from '../../../library/axiosRetry'
import language from '../../../language'
import { DEFAULT_QUERY_LIMIT } from '../../../library/constants/constants'

const SubmittedRecordsMixin = (Base) =>
  class extends Base {
    #getSampleUnitLabel = function getSampleUnitLabel(record) {
      const sampleUnit = `${record.sample_unit_number ?? ''} ${record.label ?? ''}`.trim()

      return sampleUnit === '' ? undefined : sampleUnit
    }

    getSubmittedRecordsFromApi = async function getSubmittedRecordsFromApi(projectId, pageNo) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/projects/${projectId}/sampleunitmethods/`, {
              params: {
                protocol: `fishbelt,benthiclit,benthicpit,habitatcomplexity,bleachingqc,benthicpqt`,
                page: pageNo,
                limit: DEFAULT_QUERY_LIMIT,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecords = async function getSubmittedRecords(projectId, pageNo = 1) {
      const apiResultData = await this.getSubmittedRecordsFromApi(projectId, pageNo)
      const { results, count } = apiResultData

      if (pageNo * DEFAULT_QUERY_LIMIT < count) {
        return [...results].concat(await this.getSubmittedRecords(projectId, pageNo + 1))
      }

      return results
    }

    getSubmittedSampleUnitRecord = async function getSubmittedSampleUnitRecord(
      projectId,
      id,
      sampleUnitMethod,
    ) {
      if (!(id || projectId || sampleUnitMethod)) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/${sampleUnitMethod}/${id}`,
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
            return submittedRecords?.map((record) => ({
              ...record,
              uiLabels: {
                depth: record.depth,
                management: record.management_name,
                observers: record.observers?.join(', '),
                protocol: language.protocolTitles[record.protocol],
                sampleDate: getSampleDateLabel(record.sample_date),
                sampleUnitNumber: this.#getSampleUnitLabel(record),
                site: record.site_name,
                size: record.size_display,
              },
            }))
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    moveToCollect = async function moveToCollect({
      projectId,
      submittedRecordId,
      sampleUnitMethod,
    }) {
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
              `${this._apiBaseUrl}/projects/${projectId}/${sampleUnitMethod}/${submittedRecordId}/edit/`,
              {},
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then(() => this._apiSyncInstance.pushThenPullAllProjectDataExceptChoices(projectId))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    exportSubmittedRecords = async function exportSubmittedRecords({ projectId, protocol }) {
      const token = await this._getAccessToken()

      const method = getProtocolMethodsType(protocol)

      const report_url = `${this._apiBaseUrl}/projects/${projectId}/${method}/xlsx/?access_token=${token}`

      window.open(report_url)
    }
  }

export default SubmittedRecordsMixin

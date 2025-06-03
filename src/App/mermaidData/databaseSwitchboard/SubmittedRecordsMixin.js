import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getProtocolMethodsType } from '../recordProtocolHelpers'
import { getSampleDateLabel } from '../getSampleDateLabel'
import axios from '../../../library/axiosRetry'
import language from '../../../language'
import { DEFAULT_RECORDS_PER_PAGE } from '../../../library/constants/constants'

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
                limit: DEFAULT_RECORDS_PER_PAGE,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSubmittedRecordsByPage = async function getSubmittedRecordsByPage(projectId, pageNo = 1) {
      const apiResultData = await this.getSubmittedRecordsFromApi(projectId, pageNo)
      const { results, count: totalRecordsCount } = apiResultData
      const totalPages = Math.ceil(totalRecordsCount / DEFAULT_RECORDS_PER_PAGE)

      if (pageNo < totalPages) {
        return [...results].concat(await this.getSubmittedRecordsByPage(projectId, pageNo + 1))
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
              `${this._apiBaseUrl}/projects/${projectId}/${sampleUnitMethod}/${id}/`,
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
        ? this.getSubmittedRecordsByPage(projectId).then((submittedRecords) => {
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
            .then((res) => {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return res.data
                })
            })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    exportSubmittedRecords = async function exportSubmittedRecords({ projectId, protocol }) {
      if (!projectId || !protocol) {
        return Promise.reject(this._operationMissingParameterError)
      }

      const token = await this._getAccessToken()
      const method = getProtocolMethodsType(protocol)
      const report_url = `${this._apiBaseUrl}/projects/${projectId}/${method}/xlsx/?access_token=${token}`

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(report_url, {
              responseType: 'blob',
            })
            .then((response) => {
              const contentDisposition = response.headers['content-disposition']
              const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/["']/g, '')
                : `${projectId}_${protocol}_${new Date().toISOString().split('T')[0]}.zip`

              const url = window.URL.createObjectURL(new Blob([response.data]))

              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', filename)
              document.body.appendChild(link)
              link.click()

              link.parentNode.removeChild(link)
              window.URL.revokeObjectURL(url)
            })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SubmittedRecordsMixin

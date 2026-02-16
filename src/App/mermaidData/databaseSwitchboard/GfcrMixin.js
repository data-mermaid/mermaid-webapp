import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getPaginatedMermaidData } from '../getPaginatedMermaidData'

const GfcrMixin = (Base) =>
  class extends Base {
    getIndicatorSets = async function getIndicatorSets(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (!this._isOnlineAuthenticatedAndReady) {
        return Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return await getPaginatedMermaidData({
        url: `${this._apiBaseUrl}/projects/${projectId}/indicatorsets/`,
        authorizationHeaders: await getAuthorizationHeaders(this._getAccessToken),
        axios,
        errorCallback: () => {
          return Promise.reject(this._notAuthenticatedAndReadyError)
        },
      })
    }

    // eslint-disable-next-line consistent-return
    saveIndicatorSet = async function saveIndicatorSet(projectId, editedValues) {
      if (!projectId || !editedValues) {
        throw new Error(this._operationMissingParameterError)
      }

      // PUT the indicator set if there is an indicator set ID (i.e. it is an existing indicator set)
      if (editedValues.id) {
        return this._isOnlineAuthenticatedAndReady
          ? axios
              .put(
                `${this._apiBaseUrl}/projects/${projectId}/indicatorsets/${editedValues.id}/`,
                editedValues,
                await getAuthorizationHeaders(this._getAccessToken),
              )
              .then((apiResults) => apiResults.data)
          : Promise.reject(this._notAuthenticatedAndReadyError)
      }

      // POST the indicator set if there is no indicator set ID (i.e. it is a new indicator set)
      if (!editedValues.id) {
        return this._isOnlineAuthenticatedAndReady
          ? axios
              .post(
                `${this._apiBaseUrl}/projects/${projectId}/indicatorsets/`,
                editedValues,
                await getAuthorizationHeaders(this._getAccessToken),
              )
              .then((apiResults) => apiResults.data)
          : Promise.reject(this._notAuthenticatedAndReadyError)
      }
    }

    exportData = async function exportData(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      const payload = {
        report_type: 'gfcr',
        project_ids: [projectId],
        background: false,
      }

      const config = await getAuthorizationHeaders(this._getAccessToken)

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .post(`${this._apiBaseUrl}/reports/`, payload, {
              ...config,
              responseType: 'arraybuffer',
            })
            .then((res) => {
              const url = window.URL.createObjectURL(new Blob([res.data]))

              // create link and click to download file
              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', 'gfcr-report.zip')
              document.body.appendChild(link)
              link.click()
              link.parentNode.removeChild(link)
            })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteIndicatorSet = async function deleteIndicatorSet(projectId, indicatorSetId) {
      if (!projectId || !indicatorSetId) {
        throw new Error(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .delete(
              `${this._apiBaseUrl}/projects/${projectId}/indicatorsets/${indicatorSetId}/`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default GfcrMixin

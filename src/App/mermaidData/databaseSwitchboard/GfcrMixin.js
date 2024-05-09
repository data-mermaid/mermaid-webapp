import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const GfcrMixin = (Base) =>
  class extends Base {
    getIndicatorSets = async function getIndicatorSets(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/indicatorsets/`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    saveIndicatorSet = async function saveIndicatorSet(projectId, editedValues) {
      if (!projectId || !editedValues) {
        throw new Error(this._operationMissingParameterError)
      }

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
  }

export default GfcrMixin

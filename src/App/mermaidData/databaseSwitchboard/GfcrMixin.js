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

import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ImageClassificationMixin = (Base) =>
  class extends Base {
    getAnnotationsForImage = async function getAnnotationsForImage(projectId, imageId) {
      if (!imageId || !projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/classification/images/${imageId}`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    saveAnnotationsForImage = async function saveAnnotationsForImage(projectId, imageId, points) {
      if (!imageId || !projectId || !points.length) {
        Promise.reject(this._operationMissingParameterError)
      }

      const payload = { id: imageId, points }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .patch(
              `${this._apiBaseUrl}/projects/${projectId}/classification/images/${imageId}/`,
              payload,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ImageClassificationMixin
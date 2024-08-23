import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ImageClassificationMixin = (Base) =>
  class extends Base {
    getAnnotationsForImage = async function getAnnotationsForImage(projectId, imageId) {
      if (!imageId || !projectId) {
        return Promise.reject(this._operationMissingParameterError)
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
  }

export default ImageClassificationMixin

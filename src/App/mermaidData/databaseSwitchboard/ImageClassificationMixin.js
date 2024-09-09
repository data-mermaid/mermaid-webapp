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

    uploadImage = async function uploadImage(projectId, recordId, file) {
      if (!projectId || !recordId || !file) {
        return Promise.reject(this._operationMissingParameterError)
      }

      const formData = new FormData()
      formData.append('collect_record_id', recordId)
      formData.append('image', file)

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .post(`${this._apiBaseUrl}/projects/${projectId}/classification/images/`, formData, {
              headers: {
                ...(await getAuthorizationHeaders(this._getAccessToken)).headers,
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getAllImagesInProject = async (projectId, collectRecordId, excludeParams = '') => {
      if (!projectId || !collectRecordId) {
        throw new Error('projectId and collectRecordId are required parameters.')
      }

      const queryParams = new URLSearchParams({ collect_record_id: collectRecordId })

      if (excludeParams) {
        queryParams.append('exclude', excludeParams)
      }

      const queryString = `?${queryParams.toString()}`

      if (!this._isOnlineAuthenticatedAndReady) {
        throw this._notAuthenticatedAndReadyError
      }

      try {
        const headers = await getAuthorizationHeaders(this._getAccessToken)

        const response = await axios.get(
          `${this._apiBaseUrl}/projects/${projectId}/classification/images/${queryString}`,
          headers,
        )

        return response.data
      } catch (error) {
        throw new Error(`Error fetching images: ${error.message}`)
      }
    }
  }

export default ImageClassificationMixin

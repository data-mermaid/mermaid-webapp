import axios from 'axios'
import { response } from 'msw'
import language from '../../../language'

const DatabaseSwitchboardState = class {
  _apiBaseUrl

  _apiSyncInstance

  _authenticatedAxios

  _isAuthenticatedAndReady

  _isOfflineAuthenticatedAndReady

  _isOnlineAuthenticatedAndLoading

  _isOnlineAuthenticatedAndReady

  _dexieInstance

  _notAuthenticatedAndReadyError = new Error(language.error.appNotAuthenticatedOrReady)

  _operationMissingIdParameterError = new Error('This operation requires an id to be supplied')

  _operationMissingParameterError = new Error(
    "This operation requires a parameter that isn't being supplied",
  )

  _getIsApiDataItemStatusSuccessful

  constructor({
    apiBaseUrl,
    apiSyncInstance,
    auth0Token,
    dexieInstance,
    isMermaidAuthenticated,
    isAppOnline,
  }) {
    this._apiBaseUrl = apiBaseUrl
    this._apiSyncInstance = apiSyncInstance
    this._dexieInstance = dexieInstance
    this._isAuthenticatedAndReady = isMermaidAuthenticated && !!dexieInstance

    this._authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
    this._isOnlineAuthenticatedAndReady =
      this._isAuthenticatedAndReady && isAppOnline && !!this._authenticatedAxios
    this._isOnlineAuthenticatedAndLoading =
      this._isAuthenticatedAndReady && isAppOnline && !this._authenticatedAxios
    this._isOfflineAuthenticatedAndReady = this._isAuthenticatedAndReady && !isAppOnline
  }

  _getIsApiDataItemStatusSuccessful = (dataItemFromServer) => {
    const statusCode = dataItemFromServer.status_code

    return statusCode >= 200 && statusCode < 300
  }

  _getDoesApiResponseHaveSuccessfulStatus = (apiResponse) => {
    const { status } = apiResponse

    return status >= 200 && status < 300
  }
}

export default DatabaseSwitchboardState

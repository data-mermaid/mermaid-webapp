import language from '../../../language'

const DatabaseSwitchboardState = class {
  _apiBaseUrl

  _apiSyncInstance

  _getAccessToken

  _dexiePerUserDataInstance

  _isAuthenticatedAndReady

  _isOfflineAuthenticatedAndReady

  _isOnlineAuthenticatedAndReady

  _isStatusCodeSuccessful = function _isStatusCodeSuccessful(statusValue) {
    return statusValue >= 200 && statusValue < 300
  }

  _notAuthenticatedAndReadyError = new Error(language.error.appNotAuthenticatedOrReady)

  _operationMissingIdParameterError = new Error('This operation requires an id to be supplied')

  _operationMissingParameterError = new Error(
    "This operation requires a parameter that isn't being supplied",
  )

  constructor({
    apiBaseUrl,
    apiSyncInstance,
    getAccessToken,
    dexiePerUserDataInstance,
    isMermaidAuthenticated,
    isAppOnline,
  }) {
    this._apiBaseUrl = apiBaseUrl
    this._apiSyncInstance = apiSyncInstance
    this._getAccessToken = getAccessToken
    this._dexiePerUserDataInstance = dexiePerUserDataInstance
    this._isAuthenticatedAndReady = isMermaidAuthenticated && !!dexiePerUserDataInstance

    this._isOnlineAuthenticatedAndReady = this._isAuthenticatedAndReady && isAppOnline
    this._isOfflineAuthenticatedAndReady = this._isAuthenticatedAndReady && !isAppOnline
  }
}

export default DatabaseSwitchboardState

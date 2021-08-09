import axios from 'axios'
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

  _notAuthenticatedAndReadyError = new Error(
    language.error.appNotAuthenticatedOrReady,
  )

  _operationMissingIdParameterError = new Error(
    'This operation requires an id to be supplied',
  )

  _operationMissingParameterError = new Error(
    "This operation requires a parameter that isn't being supplied",
  )

  constructor({
    apiBaseUrl,
    apiSyncInstance,
    auth0Token,
    dexieInstance,
    isMermaidAuthenticated,
    isOfflineStorageHydrated,
    isOnline,
  }) {
    this._apiBaseUrl = apiBaseUrl
    this._apiSyncInstance = apiSyncInstance
    this._dexieInstance = dexieInstance
    this._isAuthenticatedAndReady =
      isMermaidAuthenticated && !!dexieInstance && isOfflineStorageHydrated

    this._authenticatedAxios = auth0Token
      ? axios.create({
          headers: {
            Authorization: `Bearer ${auth0Token}`,
          },
        })
      : undefined
    this._isOnlineAuthenticatedAndReady =
      this._isAuthenticatedAndReady && isOnline && !!this._authenticatedAxios
    this._isOnlineAuthenticatedAndLoading =
      this._isAuthenticatedAndReady && isOnline && !this._authenticatedAxios
    this._isOfflineAuthenticatedAndReady =
      this._isAuthenticatedAndReady && !isOnline
  }
}

export default DatabaseSwitchboardState

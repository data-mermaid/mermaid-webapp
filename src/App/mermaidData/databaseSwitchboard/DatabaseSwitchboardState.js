import i18next from 'i18next'
import { getSampleUnitLabel as getAssociatedSubmittedSampleUnitObjectsIncludingUiLabel } from '../getSampleUnitLabel'

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

  _getMermaidDataPushSyncStatusCodeError = function _getMermaidDataPushSyncStatusCodeError({
    mermaidDataTypeName,
    pushResponse,
  }) {
    // The api and code has evolved to have various 'error' info formats.
    // If there is no special error format from the API, we stick to a standard JS error instance.
    // For 500 and 40x, there is an error object with isSyncError and
    // isDeleteRejectedError booleans. isSyncError helps the component differentiate
    // between an http error and a nested error from a push. isDeleteRejectedError
    //  helps the DatabaseSwitchboard know it should rollback the _deleted
    // and uiState_pushToApi property in
    // browser storage so that the UI doesnt keep trying to push a record that
    // has been rejected from being deleted because of association conflicts.
    // A 409 error object will include an associatedSampleUnits property containing
    // an array of associated submitted records that are connected to the thing
    // attempting to be deleted. Its array format pre-existed this work and the UI
    // component is already set up to list the associated sample units to the user with it.
    // Other 400 status codes will have a property, statusCodeReasons, whose value is an object.
    // as of this comment writing, any key values pairs will be listed out to the user.
    // This format also has preexisting component code that already works with it
    // and at the time of this function's creation, creating a common format and
    // refactoring was out of reasonable scope of this work.
    const itemReturnedFromApiPush = pushResponse.data[mermaidDataTypeName][0]
    const statusCode = itemReturnedFromApiPush.status_code

    console.error('nested sync error', { itemReturnedFromApiPush, statusCode })

    // if 500 we spare the user from all the tech reasons things went wrong, and just return standard error with text
    // Other 50X wont occur with status_code.
    // status_code errors from a push response are NOT related to HTTP.
    // Their values are just borrowing meaning from HTTP)
    // project synonyms for push status code errors are 'nested errors', or 'push sub-node errors'
    if (statusCode === 500) {
      const error = new Error(i18next.t('error.http_500'))

      error.isSyncError = true

      return error
    }

    // if 40X, we return the api error object
    if (statusCode >= 400 && statusCode < 500 && statusCode !== 409) {
      // The data property on the returned project management
      // item is an object with properties that are assumed to be error messages.
      // They will be converted into a list of error messages for the user in the UI

      const error = {
        statusCodeReasons: pushResponse.data[mermaidDataTypeName][0].data,
        isSyncError: true,
      }

      return error
    }

    if (statusCode === 409) {
      const { sampleevent, ...sampleUnitProtocols } = itemReturnedFromApiPush.data // eslint-disable-line @typescript-eslint/no-unused-vars
      const sampleUnitProtocolValues = Object.values(sampleUnitProtocols).flat()
      const associatedSampleUnits =
        getAssociatedSubmittedSampleUnitObjectsIncludingUiLabel(sampleUnitProtocolValues)

      const error = {
        isSyncError: true,
        isDeleteRejectedError: true,
        associatedSampleUnits,
      }

      return error
    }

    return undefined
  }

  _notAuthenticatedAndReadyError = new Error(i18next.t('error.app_not_authenticated'))

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

import {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../../../../testUtilities/mockDexie'
import ApiSync from '../../ApiSync/ApiSync'
import DatabaseSwitchboard from '../DatabaseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess = () => {
  const auth0Token = 'fake token'
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance,
    apiSyncInstance: new ApiSync({ dexieInstance, apiBaseUrl, auth0Token }),
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError = () => {
  const auth0Token = 'fake token'
  const dexieInstance = getMockDexieInstanceThatProducesErrors()

  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance,
    apiSyncInstance: new ApiSync({ dexieInstance, apiBaseUrl, auth0Token }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError = () => {
  const auth0Token = 'fake token'
  const dexieInstance = getMockDexieInstanceThatProducesErrors()

  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance,
    apiSyncInstance: new ApiSync({ dexieInstance, apiBaseUrl, auth0Token }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess = () => {
  const auth0Token = 'fake token'
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance,
    apiSyncInstance: new ApiSync({ dexieInstance, apiBaseUrl, auth0Token }),
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

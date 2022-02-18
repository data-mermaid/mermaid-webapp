import { getFakeAccessToken } from '../../../../testUtilities/getFakeAccessToken'
import {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../../../../testUtilities/mockDexie'
import SyncApiDataIntoOfflineStorage from '../../syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import DatabaseSwitchboard from '../DatabaseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess = () => {
  const getAccessToken = async() => 'fake token'
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
    }),
    getAccessToken,
    dexieInstance,
    isMermaidAuthenticated: true,
    isOfflineStorageHydrated: true,
    isAppOnline: true,
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError = () => {
  const getAccessToken = async() => 'fake token'
  const dexieInstance = getMockDexieInstanceThatProducesErrors()

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: true,
    dexieInstance,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
    }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError = () => {
  const getAccessToken = async() => 'fake token'
  const dexieInstance = getMockDexieInstanceThatProducesErrors()

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: false,
    dexieInstance,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
    }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess = () => {
  const getAccessToken = async() => 'fake token'
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
    }),
    getAccessToken,
    dexieInstance,
    isMermaidAuthenticated: true,
    isOfflineStorageHydrated: true,
    isAppOnline: false,
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

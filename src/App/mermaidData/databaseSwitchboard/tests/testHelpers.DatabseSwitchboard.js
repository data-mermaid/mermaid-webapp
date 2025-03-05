import { getFakeAccessToken } from '../../../../testUtilities/getFakeAccessToken'
import {
  getMockDexieInstancesAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../../../../testUtilities/mockDexie'
import SyncApiDataIntoOfflineStorage from '../../syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import DatabaseSwitchboard from '../DatabaseSwitchboard'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess = () => {
  const getAccessToken = async () => 'fake token'
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const databaseSwitchboardInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
    getAccessToken,
    dexiePerUserDataInstance,
    isMermaidAuthenticated: true,
    isOfflineStorageHydrated: true,
    isAppOnline: true,
  })

  databaseSwitchboardInstance.dexiePerUserDataInstance = dexiePerUserDataInstance

  return databaseSwitchboardInstance
}

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError = () => {
  const getAccessToken = async () => 'fake token'
  const dexiePerUserDataInstance = getMockDexieInstanceThatProducesErrors()

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: true,
    dexiePerUserDataInstance: getMockDexieInstanceThatProducesErrors(),
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError = () => {
  const getAccessToken = async () => 'fake token'

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: false,
    dexiePerUserDataInstance: getMockDexieInstanceThatProducesErrors(),
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance: getMockDexieInstanceThatProducesErrors(),
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess = () => {
  const getAccessToken = async () => 'fake token'
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  const databaseSwitchboardInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
    getAccessToken,
    dexiePerUserDataInstance,
    isMermaidAuthenticated: true,
    isOfflineStorageHydrated: true,
    isAppOnline: false,
  })

  databaseSwitchboardInstance.dexiePerUserDataInstance = dexiePerUserDataInstance

  return databaseSwitchboardInstance
}

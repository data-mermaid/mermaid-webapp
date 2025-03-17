import { getMockDexieInstancesAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SyncApiDataIntoOfflineStorage from '../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { getFakeAccessToken } from './getFakeAccessToken'

const getAccessToken = async () => 'fake token'
const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const getMockOnlineDatabaseSwitchboardInstance = ({ dexiePerUserDataInstance }) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: true,
    dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
    isOfflineStorageHydrated: true,
  })
}

const getMockOfflineDatabaseSwitchboardInstance = ({ dexiePerUserDataInstance }) => {
  const { dexiePerUserDataInstance: defaultDexieUserDataDatabaseInstance } =
    getMockDexieInstancesAllSuccess()
  const dexieUserDataDatabaseInstanceToUse =
    dexiePerUserDataInstance ?? defaultDexieUserDataDatabaseInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: false,
    dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexiePerUserDataInstance: dexieUserDataDatabaseInstanceToUse,
      apiBaseUrl,
      getAccessToken: getFakeAccessToken,
      handleUserDeniedSyncPull: () => {},
      handleUserDeniedSyncPush: () => {},
      handleNested500SyncError: () => {},
    }),
    isOfflineStorageHydrated: true,
  })
}

export { getMockOnlineDatabaseSwitchboardInstance, getMockOfflineDatabaseSwitchboardInstance }

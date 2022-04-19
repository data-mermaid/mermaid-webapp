import { getMockDexieInstancesAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SyncApiDataIntoOfflineStorage from '../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'
import { getFakeAccessToken } from './getFakeAccessToken'

const getAccessToken = async () => 'fake token'
const apiBaseUrl = process.env.REACT_APP_MERMAID_API

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
    }),
    isOfflineStorageHydrated: true,
  })
}

export { getMockOnlineDatabaseSwitchboardInstance, getMockOfflineDatabaseSwitchboardInstance }

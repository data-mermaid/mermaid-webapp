import { getMockDexieInstanceAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SyncApiDataIntoOfflineStorage from '../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'

const defaultDexieInstance = getMockDexieInstanceAllSuccess()
const getAccessToken = async() => 'fake token'
const apiBaseUrl = process.env.REACT_APP_MERMAID_API

const getMockOnlineDatabaseSwitchboardInstance = (dexieInstance) => {
  const dexieInstanceToUse = dexieInstance ?? defaultDexieInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: true,
    dexieInstance: dexieInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance: dexieInstanceToUse,
      apiBaseUrl,
      getAccessToken,
    }),
    isOfflineStorageHydrated: true,
  })
}

const getMockOfflineDatabaseSwitchboardInstance = (dexieInstance) => {
  const dexieInstanceToUse = dexieInstance ?? defaultDexieInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    getAccessToken,
    isMermaidAuthenticated: true,
    isAppOnline: false,
    dexieInstance: dexieInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance: dexieInstanceToUse,
      apiBaseUrl,
      getAccessToken,
    }),
    isOfflineStorageHydrated: true,
  })
}

export { getMockOnlineDatabaseSwitchboardInstance, getMockOfflineDatabaseSwitchboardInstance }

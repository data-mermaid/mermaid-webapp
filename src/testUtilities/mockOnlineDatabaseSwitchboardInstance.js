import { getMockDexieInstanceAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import SyncApiDataIntoOfflineStorage from '../App/mermaidData/syncApiDataIntoOfflineStorage/SyncApiDataIntoOfflineStorage'

const defaultDexieInstance = getMockDexieInstanceAllSuccess()
const auth0Token = 'token'
const apiBaseUrl = process.env.REACT_APP_MERMAID_API

const getMockOnlineDatabaseSwitchboardInstance = (dexieInstance) => {
  const dexieInstanceToUse = dexieInstance ?? defaultDexieInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance: dexieInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance: dexieInstanceToUse,
      apiBaseUrl,
      auth0Token,
    }),
    isOfflineStorageHydrated: true,
  })
}

const getMockOfflineDatabaseSwitchboardInstance = (dexieInstance) => {
  const dexieInstanceToUse = dexieInstance ?? defaultDexieInstance

  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token,
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: dexieInstanceToUse,
    apiSyncInstance: new SyncApiDataIntoOfflineStorage({
      dexieInstance: dexieInstanceToUse,
      apiBaseUrl,
      auth0Token,
    }),
    isOfflineStorageHydrated: true,
  })
}

export {
  getMockOnlineDatabaseSwitchboardInstance,
  getMockOfflineDatabaseSwitchboardInstance,
}

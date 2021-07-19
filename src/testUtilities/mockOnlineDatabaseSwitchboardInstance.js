import { getMockDexieInstanceAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import ApiSync from '../App/mermaidData/ApiSync/ApiSync'

const defaultDexieInstance = getMockDexieInstanceAllSuccess()
const getMockOnlineDatabaseSwitchboardInstance = (dexieInstance) =>
  new DatabaseSwitchboard({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'token',
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance: dexieInstance ?? defaultDexieInstance,
    apiSyncInstance: new ApiSync(defaultDexieInstance),
  })

const getMockOfflineDatabaseSwitchboardInstance = (dexieInstance) =>
  new DatabaseSwitchboard({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'token',
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: dexieInstance ?? defaultDexieInstance,
    apiSyncInstance: new ApiSync(defaultDexieInstance),
  })

export {
  getMockOnlineDatabaseSwitchboardInstance,
  getMockOfflineDatabaseSwitchboardInstance,
}

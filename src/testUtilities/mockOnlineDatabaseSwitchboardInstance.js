import { getMockDexieInstanceAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import ApiSync from '../App/mermaidData/ApiSync/ApiSync'

const dexieInstance = getMockDexieInstanceAllSuccess()
const mockOnlineDatabaseSwitchboardInstance = new DatabaseSwitchboard({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  dexieInstance,
  apiSyncInstance: new ApiSync(dexieInstance),
})

const mockOfflineDatabaseSwitchboardInstance = new DatabaseSwitchboard({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: false,
  dexieInstance,
  apiSyncInstance: new ApiSync(dexieInstance),
})

export {
  mockOnlineDatabaseSwitchboardInstance,
  mockOfflineDatabaseSwitchboardInstance,
}

import { getMockDexieInstanceAllSuccess } from './mockDexie'
import DatabaseSwitchboard from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'

const mockOnlineDatabaseSwitchboardInstance = new DatabaseSwitchboard({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  dexieInstance: getMockDexieInstanceAllSuccess(),
})

export default mockOnlineDatabaseSwitchboardInstance

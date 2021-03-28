import DatabaseGateway from '../App/mermaidData/DatabaseGateway'
import { getMockDexieInstanceAllSuccess } from './mockDexie'

const mockOnlineDatabaseGatewayInstance = new DatabaseGateway({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  dexieInstance: getMockDexieInstanceAllSuccess(),
})

export default mockOnlineDatabaseGatewayInstance

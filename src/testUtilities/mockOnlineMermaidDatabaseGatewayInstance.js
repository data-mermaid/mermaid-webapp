import MermaidDatabaseGateway from '../App/mermaidData/MermaidDatabaseGateway'
import { getMockDexieInstanceAllSuccess } from './mockDexie'

const mockOnlineMermaidDatabaseGatewayInstance = new MermaidDatabaseGateway({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  dexieInstance: getMockDexieInstanceAllSuccess(),
})

export default mockOnlineMermaidDatabaseGatewayInstance

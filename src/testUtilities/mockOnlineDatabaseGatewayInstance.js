import DatabaseGateway from '../library/mermaidData/DatabaseGateway'
import getMockDexieInstance from './getMockDexieInstance'

const mockOnlineDatabaseGatewayInstance = new DatabaseGateway({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  dexieInstance: getMockDexieInstance(),
})

export default mockOnlineDatabaseGatewayInstance

import MermaidDatabaseGateway from '../library/mermaidData/MermaidDatabaseGateway'
import { getMockMermaidDbAccessInstance } from './mockMermaidDbAccess'

const mockOnlineMermaidDatabaseGatewayInstance = new MermaidDatabaseGateway({
  apiBaseUrl: process.env.REACT_APP_MERMAID_API,
  auth0Token: 'token',
  isMermaidAuthenticated: true,
  isOnline: true,
  mermaidDbAccessInstance: getMockMermaidDbAccessInstance(),
})

export default mockOnlineMermaidDatabaseGatewayInstance

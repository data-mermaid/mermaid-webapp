import {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceError,
} from '../../../../testUtilities/mockDexie'
import DatabaseSwitchboard from '../DatabaseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

export const getDatabaseSwitchboardInstanceAuthenticatedOnline = () => {
  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance: getMockDexieInstanceAllSuccess(), // doesnt get called because isOnline=true
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError = () => {
  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: getMockDexieInstanceError(),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineAllSuccess = () => {
  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: getMockDexieInstanceAllSuccess(),
  })
}

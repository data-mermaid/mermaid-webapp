import {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceThatProducesErrors,
} from '../../../../testUtilities/mockDexie'
import DatabaseSwitchboard from '../DatabaseSwitchboard'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess = () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance,
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

export const getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieError = () => {
  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: true,
    dexieInstance: getMockDexieInstanceThatProducesErrors(),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieError = () => {
  return new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: getMockDexieInstanceThatProducesErrors(),
  })
}

export const getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess = () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  const dbInstance = new DatabaseSwitchboard({
    apiBaseUrl,
    auth0Token: 'fake token',
    isMermaidAuthenticated: true,
    isOnline: false,
    dexieInstance: getMockDexieInstanceAllSuccess(),
  })

  dbInstance.dexieInstance = dexieInstance

  return dbInstance
}

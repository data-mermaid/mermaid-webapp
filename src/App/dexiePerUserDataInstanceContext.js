import Dexie from 'dexie'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useState, useEffect } from 'react'

import dexieInstancePropTypes from './dexieInstancePropTypes'

const DexiePerUserDataInstanceContext = createContext()

// the value prop spread here allows for online status to be mocked for testing
const DexiePerUserDataInstanceProvider = ({ children, value = {} }) => {
  const [dexiePerUserDataInstance, setDexiePerUserDataInstance] = useState()

  return (
    <DexiePerUserDataInstanceContext.Provider
      value={{ dexiePerUserDataInstance, setDexiePerUserDataInstance, ...value }}
    >
      {children}
    </DexiePerUserDataInstanceContext.Provider>
  )
}

const useDexiePerUserDataInstance = ({ currentUser }) => {
  const context = useContext(DexiePerUserDataInstanceContext)
  const { setDexiePerUserDataInstance } = context
  const userId = currentUser?.id

  if (context === undefined) {
    throw new Error(
      'useDexiePerUserDataInstance must be used within a DexiePerUserDataInstanceProvider',
    )
  }

  const _initializePerUserDexieInstance = useEffect(() => {
    if (userId) {
      const dexiePerUserDataInstance = new Dexie(userId)

      dexiePerUserDataInstance.version(2).stores({
        benthic_attributes: 'id',
        choices: 'id',
        collect_records: 'id, project',
        fish_families: 'id',
        fish_groupings: 'id',
        fish_genera: 'id',
        fish_species: 'id',
        project_managements: 'id, project',
        project_profiles: 'id, project',
        project_sites: 'id, project',
        projects: 'id',
        uiState_lastRevisionNumbersPulled: '[dataType+projectId], projectId',
        uiState_offlineReadyProjects: 'id',
      })
      setDexiePerUserDataInstance(dexiePerUserDataInstance)
    }
  }, [userId, setDexiePerUserDataInstance])

  return context
}

DexiePerUserDataInstanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    dexiePerUserDataInstance: dexieInstancePropTypes,
    setDexiePerUserDataInstance: PropTypes.func,
  }),
}

export { DexiePerUserDataInstanceProvider, useDexiePerUserDataInstance }

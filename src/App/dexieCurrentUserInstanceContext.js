import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

import dexieInstancePropTypes from './dexieInstancePropTypes'
import dexieCurrentUserInstance from './dexieCurrentUserInstance'

const DexieCurrentUserInstanceContext = createContext()

const DexieCurrentUserInstanceProvider = ({ children, value }) => {
  const isTestEnvironment = process.env.NODE_ENV === 'test'
  const currentUserInstanceToUse = isTestEnvironment ? value : dexieCurrentUserInstance

  return (
    <DexieCurrentUserInstanceContext.Provider value={currentUserInstanceToUse}>
      {children}
    </DexieCurrentUserInstanceContext.Provider>
  )
}

const useDexieCurrentUserInstance = () => {
  const context = useContext(DexieCurrentUserInstanceContext)

  if (context === undefined) {
    throw new Error(
      'useDexieCurrentUserInstance must be used within a DexieCurrentUserInstanceProvider',
    )
  }

  return context
}

DexieCurrentUserInstanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    dexieCurrentUserInstance: dexieInstancePropTypes,
  }),
}

DexieCurrentUserInstanceProvider.defaultProps = { value: {} }

export { DexieCurrentUserInstanceProvider, useDexieCurrentUserInstance }

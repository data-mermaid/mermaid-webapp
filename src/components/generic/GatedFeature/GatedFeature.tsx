import React, { ReactNode } from 'react'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { getCurrentUserOptionalFeature } from '../../../library/getCurrentUserOptionalFeature'

interface GatedFeatureProps {
  featureFlag: string
  children: ReactNode
}

const GatedFeature: React.FC<GatedFeatureProps> = ({ featureFlag, children }) => {
  const { currentUser } = useCurrentUser()
  const { enabled: isFeatureEnabled = false } =
    getCurrentUserOptionalFeature(currentUser, featureFlag) ?? {}

  return isFeatureEnabled ? children : null
}

export default GatedFeature

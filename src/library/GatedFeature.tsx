import React, { ReactNode } from 'react'
import { useCurrentUser } from '../App/CurrentUserContext'
import { getCurrentUserOptionalFeature } from './getCurrentUserOptionalFeature'

interface GatedFeatureProps {
  featureFlag: string
  children: ReactNode
}

/**
 * Conditionally renders children based on a feature flag.
 * Used to gate UI surfaces behind backend-controlled feature flags.
 * When the feature is enabled, children are rendered; otherwise, nothing is rendered.
 *
 * @param {string} featureFlag - The name of the feature flag to check (e.g., 'macroinvertebrate_enabled')
 * @param {React.ReactNode} children - The content to render when the feature flag is enabled
 */
const GatedFeature: React.FC<GatedFeatureProps> = ({ featureFlag, children }) => {
  const { currentUser } = useCurrentUser()
  // eslint-disable-next-line no-console
  console.log('currentUser', currentUser)
  const { enabled: isFeatureEnabled = false } = getCurrentUserOptionalFeature(
    currentUser,
    featureFlag,
  )

  return isFeatureEnabled ? children : null
}

export default GatedFeature

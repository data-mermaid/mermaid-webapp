interface OptionalFeature {
  label: string
  enabled?: boolean
  [key: string]: unknown
}

interface CurrentUser {
  optional_features?: OptionalFeature[]
  [key: string]: unknown
}

/**
 * Retrieves an optional feature for the current user by its label.
 *
 * @param currentUser - The current user object.
 * @param featureLabel - The label of the optional feature to retrieve.
 * @returns The optional feature object if found, or an empty object.
 */
export const getCurrentUserOptionalFeature = (
  currentUser: CurrentUser | undefined,
  featureLabel: string,
): Partial<OptionalFeature> => {
  const optionalFeatures = currentUser?.optional_features || []
  return optionalFeatures.find((feature) => feature.label === featureLabel) || {}
}

interface OptionalFeature {
  label: string
  enabled?: boolean
}
interface CurrentUser {
  optional_features?: OptionalFeature[]
}

export const getCurrentUserOptionalFeature = (
  currentUser: CurrentUser | undefined,
  featureLabel: string,
): Partial<OptionalFeature> => {
  const optionalFeatures = currentUser?.optional_features ?? []
  return optionalFeatures.find((feature) => feature.label === featureLabel) ?? {}
}

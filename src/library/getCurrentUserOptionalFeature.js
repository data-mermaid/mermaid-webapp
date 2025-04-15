/**
 * Retrieves an optional feature for the current user by its label.
 *
 * @param {Object} currentUser - The current user object.
 * @param {string} featureLabel - The label of the optional feature to retrieve.
 * @returns {Object} The optional feature object if found, or an empty object.
 */
export const getCurrentUserOptionalFeature = (currentUser, featureLabel) => {
  const optionalFeatures = currentUser?.optional_features || []
  return optionalFeatures.find((feature) => feature.label === featureLabel) || {}
}

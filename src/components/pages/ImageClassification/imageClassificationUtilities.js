export const getBenthicAttributeLabel = (benthicAttributes, benthicAttributeId) => {
  const matchingBenthicAttribute = benthicAttributes.find(({ id }) => id === benthicAttributeId)
  return matchingBenthicAttribute?.name ?? ''
}

export const getGrowthFormLabel = (growthForms, growthFormId) => {
  const matchingGrowthForm = growthForms.find(({ id }) => id === growthFormId)
  return matchingGrowthForm?.name.toLowerCase() ?? ''
}

export const prioritizeConfirmedAnnotations = (a, b) => b.is_confirmed - a.is_confirmed

export const filterForClassifiedPoints = (points) =>
  points.filter(({ annotations }) => annotations.length > 0)

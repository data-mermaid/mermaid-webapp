export const sortManagementComplianceChoices = (managementComplianceOptions) => {
  const sortBy = ['full', 'somewhat', 'low', 'none', 'not reported']

  return managementComplianceOptions.sort(
    (a, b) => sortBy.indexOf(a.label) - sortBy.indexOf(b.label),
  )
}

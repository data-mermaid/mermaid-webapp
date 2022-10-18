export const sortManagementComplianceChoices = (managementComplianceOptions) => {
  const sortBy = ['full', 'low', 'none', 'somewhat', 'not reported']

  return managementComplianceOptions.sort(
    (a, b) => sortBy.indexOf(a.label) - sortBy.indexOf(b.label),
  )
}

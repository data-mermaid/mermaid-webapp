// Booleans default to false and strings to '' so React inputs stay controlled from first render.
// Compliance is the exception: on edit, null becomes "not reported" so the user's prior blank choice persists.
const NOT_REPORTED_COMPLIANCE_VALUE = 'not-reported'

const getManagementRegimeInitialValues = (managementRegimeRecord, isNewManagementRegime) => {
  return {
    name: managementRegimeRecord?.name ?? '',
    name_secondary: managementRegimeRecord?.name_secondary ?? '',
    est_year: managementRegimeRecord?.est_year ?? '',
    size: managementRegimeRecord?.size ?? '',
    parties: managementRegimeRecord?.parties ?? [],
    open_access: managementRegimeRecord?.open_access ?? true,
    no_take: managementRegimeRecord?.no_take ?? false,
    access_restriction: managementRegimeRecord?.access_restriction ?? false,
    periodic_closure: managementRegimeRecord?.periodic_closure ?? false,
    size_limits: managementRegimeRecord?.size_limits ?? false,
    gear_restriction: managementRegimeRecord?.gear_restriction ?? false,
    species_restriction: managementRegimeRecord?.species_restriction ?? false,
    compliance:
      managementRegimeRecord?.compliance ??
      (isNewManagementRegime ? '' : NOT_REPORTED_COMPLIANCE_VALUE),
    notes: managementRegimeRecord?.notes ?? '',
  }
}

export { getManagementRegimeInitialValues, NOT_REPORTED_COMPLIANCE_VALUE }

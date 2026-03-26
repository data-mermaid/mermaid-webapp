// All boolean fields default to false and all string fields default to '' to ensure
// controlled inputs are always controlled from the first render (avoiding React's
// "uncontrolled to controlled" warning). The compliance field intentionally defaults
// to '' rather than a specific value so no compliance option is pre-selected.
const getManagementRegimeInitialValues = (managementRegimeRecord) => {
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
    compliance: managementRegimeRecord?.compliance ?? '',
    notes: managementRegimeRecord?.notes ?? '',
  }
}

export { getManagementRegimeInitialValues }

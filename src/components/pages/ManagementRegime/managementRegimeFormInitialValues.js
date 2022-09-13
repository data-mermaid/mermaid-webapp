// Radios dont complain when initial value is undefined (because they have a value
// already and checked is the state that changes) but other inputs types do.
// An exception to this is the ManagementRulesInput which has some custom logic
// and requires values to be set for open_access and no_take.
// We also dont want 'not reported' (has empty string value) to be selected   by default,
// this is why some of these properties don't default to an empty string, but others do
const getManagementRegimeInitialValues = (managementRegimeRecord) => {
  return {
    name: managementRegimeRecord?.name ?? '',
    name_secondary: managementRegimeRecord?.name_secondary ?? '',
    est_year: managementRegimeRecord?.est_year ?? '',
    size: managementRegimeRecord?.size ?? '',
    parties: managementRegimeRecord?.parties ?? [],
    open_access: managementRegimeRecord?.open_access ?? false,
    no_take: managementRegimeRecord?.no_take ?? false,
    access_restriction: managementRegimeRecord?.access_restriction,
    periodic_closure: managementRegimeRecord?.periodic_closure,
    size_limits: managementRegimeRecord?.size_limits,
    gear_restriction: managementRegimeRecord?.gear_restriction,
    species_restriction: managementRegimeRecord?.species_restriction,
    compliance: managementRegimeRecord?.compliance,
    notes: managementRegimeRecord?.notes ?? '',
  }
}

export { getManagementRegimeInitialValues }

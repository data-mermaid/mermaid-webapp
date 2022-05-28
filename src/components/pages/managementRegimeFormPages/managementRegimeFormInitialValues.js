// radios dont complain when initial value is undefined (because they have a value
// already and checked is the state that changes), but other inputs types do
// we also dont want 'not reported' (has empty string value) to be selected
// by default, this is why some of these properties dont default to an ampty string, but others do
const getManagementRegimeInitialValues = (managementRegimeRecord) => {
  return {
    name: managementRegimeRecord?.name ?? '',
    name_secondary: managementRegimeRecord?.name_secondary ?? '',
    est_year: managementRegimeRecord?.est_year ?? '',
    size: managementRegimeRecord?.size ?? '',
    parties: managementRegimeRecord?.parties ?? [],
    open_access: managementRegimeRecord?.open_access,
    no_take: managementRegimeRecord?.no_take,
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

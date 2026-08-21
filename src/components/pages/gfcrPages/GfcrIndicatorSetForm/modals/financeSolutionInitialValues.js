import {
  isGenderSmartApplicable,
  isLocalEnterpriseApplicable,
  isUsedAnIncubatorApplicable,
} from './financeSolutionFieldVisibility'

// used_an_incubator holds "No" as null, which the form select holds as 'none'. An undefined is
// absent rather than "No", so it stays blank.
const getUsedAnIncubatorFormValue = (used_an_incubator) => {
  if (used_an_incubator === null) {
    return 'none'
  }

  return used_an_incubator ?? ''
}

const getFinanceSolutionInitialValues = (financeSolution) => {
  const {
    name = '',
    fs_type = '',
    sector = '',
    geographical_coverage = '',
    taf_name = '',
    number_of_solutions_supported_by = '0',
    used_an_incubator,
    gender_smart,
    local_enterprise,
    sustainable_finance_mechanisms,
    notes = '',
  } = financeSolution || {}

  return {
    name,
    fs_type,
    sector,
    geographical_coverage,
    taf_name,
    number_of_solutions_supported_by,
    // A stored value for a field the record's type doesn't apply to is a placeholder the submit
    // handler wrote, not an answer, so it starts blank rather than reading back as "No" once the
    // type changes to one it does apply to. Within an applicable type a boolean false is a real
    // answer, so only null and undefined become blank.
    used_an_incubator: isUsedAnIncubatorApplicable(fs_type)
      ? getUsedAnIncubatorFormValue(used_an_incubator)
      : '',
    gender_smart: isGenderSmartApplicable(fs_type) ? gender_smart ?? '' : '',
    local_enterprise: isLocalEnterpriseApplicable(fs_type) ? local_enterprise ?? '' : '',
    sustainable_finance_mechanisms: sustainable_finance_mechanisms ?? [],
    notes,
  }
}

export { getFinanceSolutionInitialValues }

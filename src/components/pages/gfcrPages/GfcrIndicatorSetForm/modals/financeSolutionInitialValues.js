const getFinanceSolutionInitialValues = (financeSolution) => {
  const {
    name = '',
    fs_type = '',
    sector = '',
    geographical_coverage = '',
    taf_name = '',
    number_of_solutions_supported_by,
    gender_smart = '',
    local_enterprise = '',
    sustainable_finance_mechanisms = [],
    notes = '',
  } = financeSolution || {}

  let used_an_incubator

  if (financeSolution) {
    // used_an_incubator is null when "No"; map to 'none' for the form select
    used_an_incubator =
      financeSolution.used_an_incubator === null ? 'none' : financeSolution.used_an_incubator
  }

  return {
    name,
    fs_type,
    sector,
    geographical_coverage,
    taf_name,
    // '' not 0: a literal 0 causes digit-concatenation in the number input (e.g. "10" → "100")
    number_of_solutions_supported_by: number_of_solutions_supported_by || '',
    used_an_incubator,
    gender_smart,
    local_enterprise,
    sustainable_finance_mechanisms,
    notes,
  }
}

export { getFinanceSolutionInitialValues }

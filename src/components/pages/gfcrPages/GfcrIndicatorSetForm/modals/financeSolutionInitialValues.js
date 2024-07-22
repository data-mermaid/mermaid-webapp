const getFinanceSolutionInitialValues = (financeSolution) => {
  const {
    name = '',
    sector = '',
    gender_smart = '',
    local_enterprise = '',
    sustainable_finance_mechanisms = [],
    notes = '',
  } = financeSolution || {}

  let used_an_incubator

  if (financeSolution) {
    // Used an incubator is a special case because it can be null.
    // We want to display 'none' in if it is null
    used_an_incubator =
      financeSolution.used_an_incubator === null ? 'none' : financeSolution.used_an_incubator
  }

  return {
    name,
    sector,
    used_an_incubator,
    gender_smart,
    local_enterprise,
    sustainable_finance_mechanisms,
    notes,
  }
}

export { getFinanceSolutionInitialValues }

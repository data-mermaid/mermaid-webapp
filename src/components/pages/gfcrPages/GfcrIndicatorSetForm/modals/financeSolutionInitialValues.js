const getFinanceSolutionInitialValues = (financeSolution) => {
  const {
    name = '',
    sector = '',
    gender_smart = false,
    local_enterprise = false,
    sustainable_finance_mechanisms = [],
  } = financeSolution || {}

  // Used an incubator is a special case because it can be null.
  // We want to display 'none' in if it is null
  const used_an_incubator =
    financeSolution && financeSolution.used_an_incubator === null ? 'none' : ''

  return {
    name,
    sector,
    used_an_incubator,
    gender_smart,
    local_enterprise,
    sustainable_finance_mechanisms,
  }
}

export { getFinanceSolutionInitialValues }

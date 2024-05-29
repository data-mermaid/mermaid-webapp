const getFinanceSolutionInitialValues = (indicatorSet) => {
  const {
    name = '',
    sector = '',
    used_an_incubator = '',
    gender_smart = false,
    local_enterprise = false,
    sustainable_finance_mechanisms = [],
  } = indicatorSet ?? {}

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

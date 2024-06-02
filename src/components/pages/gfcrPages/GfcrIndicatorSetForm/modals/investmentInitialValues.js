const getInvestmentInitialValues = (investment) => {
  const {
    finance_solution,
    investment_source = '',
    investment_type = '',
    investment_amount = '',
    notes = '',
  } = investment || {}

  return {
    finance_solution,
    investment_source,
    investment_type,
    investment_amount,
    notes,
  }
}

export { getInvestmentInitialValues }

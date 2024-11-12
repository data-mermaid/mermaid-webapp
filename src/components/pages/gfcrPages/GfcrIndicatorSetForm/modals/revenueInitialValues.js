const getRevenueInitialValues = (revenue) => {
  const {
    finance_solution,
    revenue_type = '',
    sustainable_revenue_stream = '',
    revenue_amount = '',
    notes = '',
  } = revenue || {}

  return {
    finance_solution,
    revenue_type,
    sustainable_revenue_stream,
    revenue_amount,
    notes,
  }
}

export { getRevenueInitialValues }

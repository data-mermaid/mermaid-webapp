const getRevenueInitialValues = (revenue) => {
  const {
    finance_solution,
    revenue_type = '',
    sustainable_revenue_stream = '',
    annual_revenue = '',
    notes = '',
  } = revenue || {}

  return {
    finance_solution,
    revenue_type,
    sustainable_revenue_stream,
    annual_revenue,
    notes,
  }
}

export { getRevenueInitialValues }

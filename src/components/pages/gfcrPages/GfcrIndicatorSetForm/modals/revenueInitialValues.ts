import { parseApiNumber } from '../../../../../library/numbers/parseApiNumber'
import type { Revenue } from '../../../../../App/mermaidData/mermaidDataTypes'

const getRevenueInitialValues = (revenue?: Partial<Revenue>) => {
  const {
    finance_solution,
    revenue_type = '',
    sustainable_revenue_stream = '',
    revenue_amount = null,
    notes = '',
  } = revenue || {}

  return {
    finance_solution,
    revenue_type,
    sustainable_revenue_stream,
    // The API returns this as a string. Parsing here keeps formik numeric throughout, so
    // Mantine never coerces it on blur and the saved payload is a plain number.
    revenue_amount: parseApiNumber(revenue_amount),
    notes,
  }
}

export { getRevenueInitialValues }

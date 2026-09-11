import { parseGfcrNumber } from '../../../../../library/numbers/parseGfcrNumber'

const getInvestmentInitialValues = (investment) => {
  const {
    finance_solution,
    investment_source = '',
    investment_type = '',
    investment_amount = null,
    notes = '',
  } = investment || {}

  return {
    finance_solution,
    investment_source,
    investment_type,
    // The API returns this as a string. Parsing here keeps formik numeric throughout, so
    // Mantine never coerces it on blur and the saved payload is a plain number.
    investment_amount: parseGfcrNumber(investment_amount),
    notes,
  }
}

export { getInvestmentInitialValues }

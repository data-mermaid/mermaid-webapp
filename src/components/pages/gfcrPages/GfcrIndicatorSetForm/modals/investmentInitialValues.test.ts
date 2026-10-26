import { getInvestmentInitialValues } from './investmentInitialValues'

describe('getInvestmentInitialValues', () => {
  it('parses the amount the API returns as a string', () => {
    expect(getInvestmentInitialValues({ investment_amount: '1234.56' }).investment_amount).toBe(
      1234.56,
    )
  })

  it('gives a new investment a null amount', () => {
    expect(getInvestmentInitialValues(undefined).investment_amount).toBe(null)
  })

  it('treats an empty amount as null', () => {
    expect(getInvestmentInitialValues({ investment_amount: '' }).investment_amount).toBe(null)
  })
})

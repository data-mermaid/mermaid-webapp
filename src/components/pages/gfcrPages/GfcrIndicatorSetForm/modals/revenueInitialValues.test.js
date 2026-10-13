import { getRevenueInitialValues } from './revenueInitialValues'

describe('getRevenueInitialValues', () => {
  it('parses the amount the API returns as a string', () => {
    expect(getRevenueInitialValues({ revenue_amount: '900.10' }).revenue_amount).toBe(900.1)
  })

  it('gives a new revenue a null amount', () => {
    expect(getRevenueInitialValues(undefined).revenue_amount).toBe(null)
  })

  it('treats an empty amount as null', () => {
    expect(getRevenueInitialValues({ revenue_amount: '' }).revenue_amount).toBe(null)
  })
})

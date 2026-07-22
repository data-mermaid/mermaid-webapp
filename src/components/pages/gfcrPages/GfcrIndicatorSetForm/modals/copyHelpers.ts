import {
  FinanceSolution,
  InvestmentSource,
  Revenue,
} from '../../../../../App/mermaidData/mermaidDataTypes'

export type NewFinanceSolution = Omit<
  FinanceSolution,
  'id' | 'investment_sources' | 'revenues'
> & {
  investment_sources: Omit<InvestmentSource, 'id' | 'finance_solution'>[]
  revenues: Omit<Revenue, 'id' | 'finance_solution'>[]
}

// The copied finance solution doesn't have an id yet (the backend assigns one on save), so its
// nested investment_sources/revenues can't correctly reference it via finance_solution either.
// Both id fields are stripped rather than left pointing at the source finance solution's id.
export const stripId = (financeSolution: FinanceSolution): NewFinanceSolution => {
  const { id: _id, investment_sources, revenues, ...financeSolutionFields } = financeSolution

  return {
    ...financeSolutionFields,
    investment_sources: investment_sources.map(
      ({ id: _id, finance_solution: _financeSolution, ...rest }) => rest,
    ),
    revenues: revenues.map(({ id: _id, finance_solution: _financeSolution, ...rest }) => rest),
  }
}

export interface InvestmentSource {
  id: string
  finance_solution: string
  investment_source: string
  investment_type: string
  investment_amount: string
  notes: string
}

export interface Revenue {
  id: string
  finance_solution: string
  revenue_type: string
  sustainable_revenue_stream: string
  revenue_amount: string
  notes: string
}

export interface FinanceSolution {
  id: string
  name: string
  fs_type: string
  sector: string
  geographical_coverage: string
  taf_name: string
  number_of_solutions_supported_by: number
  used_an_incubator: string | null
  gender_smart: boolean
  local_enterprise: boolean
  sustainable_finance_mechanisms: string[]
  notes: string
  investment_sources: InvestmentSource[]
  revenues: Revenue[]
}

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

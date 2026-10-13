import { FinanceSolution } from '../../../../../App/mermaidData/mermaidDataTypes'

// Enough of a finance solution to identify it. Accepts saved records and unsaved formik values
// alike, since both carry a name and a type.
type FinanceSolutionIdentity = Pick<FinanceSolution, 'name' | 'fs_type'>

// Two facilities / solutions count as the same when they share a name and a type. Names are
// trimmed and lowercased so re-entered values like "Blue Reef Fund" and "blue reef fund " are
// caught. Solutions saved before the type field existed have an empty type, so they only ever
// match other untyped solutions of the same name.
export const getFinanceSolutionDuplicateKey = ({
  name,
  fs_type,
}: FinanceSolutionIdentity): string => `${(name ?? '').trim().toLowerCase()}|${fs_type ?? ''}`

export const getFinanceSolutionDuplicateKeys = (
  financeSolutions: FinanceSolutionIdentity[],
): Set<string> => new Set(financeSolutions.map(getFinanceSolutionDuplicateKey))

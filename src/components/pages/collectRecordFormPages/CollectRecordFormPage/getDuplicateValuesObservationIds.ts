/**
 * `duplicate_values` names the observation rows it covers in `context.duplicates`, one array
 * per set of rows sharing a value. Match on the code, never the property: `duplicate_images`
 * uses the same property name for a different shape (see getDuplicateValidationInfo).
 */
interface DuplicateValuesValidation {
  code?: string
  context?: {
    duplicates?: { id?: string }[][]
  }
}

export const isDuplicateValuesValidation = (validation: unknown): boolean =>
  (validation as DuplicateValuesValidation)?.code === 'duplicate_values'

const getDuplicateValuesObservationIds = (validation: unknown): string[] => {
  if (!isDuplicateValuesValidation(validation)) {
    return []
  }

  const duplicates = (validation as DuplicateValuesValidation).context?.duplicates

  if (!Array.isArray(duplicates)) {
    return []
  }

  return duplicates
    .flat()
    .map((observation) => observation?.id)
    .filter((id): id is string => typeof id === 'string')
}

export default getDuplicateValuesObservationIds

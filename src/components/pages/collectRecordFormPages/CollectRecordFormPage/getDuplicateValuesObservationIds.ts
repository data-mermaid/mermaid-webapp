/**
 * A `duplicate_values` record validation names the observation rows it covers in
 * `context.duplicates`, as one array per set of rows that share a value.
 *
 * Not `duplicate_images`, which also has a `context.duplicates` but keys it by image id
 * (see getDuplicateValidationInfo). Always match on the code, never on the property.
 */
export const DUPLICATE_VALUES_CODE = 'duplicate_values'

interface DuplicateValuesValidation {
  code?: string
  context?: {
    duplicates?: { id?: string }[][]
  }
}

export const isDuplicateValuesValidation = (validation: unknown): boolean =>
  (validation as DuplicateValuesValidation)?.code === DUPLICATE_VALUES_CODE

const getDuplicateValuesObservationIds = (validation: unknown): string[] => {
  if (!isDuplicateValuesValidation(validation)) {
    return []
  }

  const duplicates = (validation as DuplicateValuesValidation).context?.duplicates

  if (!Array.isArray(duplicates)) {
    return []
  }

  return duplicates
    .flatMap((duplicateSet) => (Array.isArray(duplicateSet) ? duplicateSet : []))
    .map((observation) => observation?.id)
    .filter((id): id is string => typeof id === 'string')
}

export default getDuplicateValuesObservationIds

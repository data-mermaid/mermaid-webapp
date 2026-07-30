import type { ValidationStatus } from '../../../../types/constants'

interface ValidationCounts {
  errorCount: number
  warningCount: number
  ignoredCount: number
}

interface ValidationsResults {
  $record?: unknown
  data?: unknown
}

const isCountableStatus = (status: unknown): status is 'error' | 'warning' | 'ignore' =>
  status === 'error' || status === 'warning' || status === 'ignore'

const updateValidationCounts = (node: unknown, counts: ValidationCounts): void => {
  // Absent sub-tree — happens on new records or fields that have never been validated
  if (node === null || node === undefined) {
    return
  }

  // Observation-level validations arrive as nested arrays (one inner array per observation)
  if (Array.isArray(node)) {
    for (const child of node) {
      updateValidationCounts(child, counts)
    }
    return
  }

  // Skip primitives — codes, ids, and context strings stored alongside validations
  if (typeof node !== 'object') {
    return
  }

  // Leaf: an object with a countable status is a single validation.
  // Stop descending to avoid double-counting nested context (e.g. duplicates array)
  const status = (node as { status?: ValidationStatus }).status
  if (isCountableStatus(status)) {
    if (status === 'error') {
      counts.errorCount += 1
    } else if (status === 'warning') {
      counts.warningCount += 1
    } else {
      counts.ignoredCount += 1
    }
    return
  }

  // Branch: a keyed object grouping validations (e.g. data.sample_event.site.<key>)
  for (const child of Object.values(node as Record<string, unknown>)) {
    updateValidationCounts(child, counts)
  }
}

const getValidationCounts = (results: ValidationsResults | undefined): ValidationCounts => {
  const counts: ValidationCounts = { errorCount: 0, warningCount: 0, ignoredCount: 0 }
  if (!results) {
    return counts
  }
  updateValidationCounts(results.$record, counts)
  updateValidationCounts(results.data, counts)
  return counts
}

export default getValidationCounts
export type { ValidationCounts, ValidationsResults }

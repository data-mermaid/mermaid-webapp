import type { ValidationStatus } from '../../../../types/constants'
import getRecordLevelValidationsToDisplay from '../getRecordLevelValidationsToDisplay'
import { getValidationsToDisplay } from '../getValidationPropertiesForInput'
import getDuplicateValuesObservationIds from './getDuplicateValuesObservationIds'

/**
 * Enumerates the rows the FormStatusIndicators bar can scroll to, bucketed by validation type.
 *
 * Per-row rules:
 *   - N validations of the same status on one row produce one target.
 *   - error preempts warning and ignore on the same row, matching getValidationsToDisplay in
 *     the input rendering path: a row showing an error inline should not also be counted as a
 *     warning by the chips.
 *
 * $record entries are not grouped. Each renders as its own <li>, so each becomes its own
 * target regardless of status.
 */

// ---- Types ------------------------------------------------------------------

interface ValidationsResults {
  $record?: unknown
  data?: unknown
}

/**
 * A row to scroll to, named by the data attribute it carries:
 *   - data-record-validation-id, on an <li> in the record-level info panel
 *   - data-validation-field, on a sample event / transect / observers row. Emitted by the
 *     shared input components from their own id, so no protocol form has to opt in.
 *   - data-observation-id, on a row in an observation table
 */
interface NavigationTarget {
  attribute: 'data-record-validation-id' | 'data-validation-field' | 'data-observation-id'
  value: string
}

interface NavigationTargets {
  error: NavigationTarget[]
  warning: NavigationTarget[]
  ignore: NavigationTarget[]
}

type CountableStatus = 'error' | 'warning' | 'ignore'

/**
 * Answers "has the user edited this input since the last validate?", keyed by formik
 * property name. An edited input hides its inline validation badge, so it must also
 * drop out of the chip counts and out of Next navigation, otherwise the chips claim
 * validations the form no longer shows. The caller owns the comparison so that the
 * badges and the chips stay driven by one rule.
 */
type IsFieldValueDirty = (formikProperty: string) => boolean

/**
 * The observation rows on the page, or null before the tables have loaded. Deleting a row
 * leaves its validations on the record, so a target outlives the row it names. Null filters
 * nothing, because an unloaded table and a deleted row look the same from here.
 */
type ObservationIdsOnPage = ReadonlySet<string> | null

// ---- Type-safe accessors (all cast-y unknown reads live here) ---------------

const isCountableStatus = (status: unknown): status is CountableStatus =>
  status === 'error' || status === 'warning' || status === 'ignore'

const getRawStatus = (value: unknown): ValidationStatus | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  return (value as { status?: ValidationStatus }).status
}

const getStatus = (value: unknown): CountableStatus | undefined => {
  const status = getRawStatus(value)
  return isCountableStatus(status) ? status : undefined
}

/**
 * `reset` means the user un-ticked "Ignore warning". At the record level the item goes back
 * to rendering as a warning (see RecordLevelValidationInfo), so it counts as one. A field's
 * `reset` validation renders nothing at all: no message, no pill, no ignore checkbox, and a
 * normal row stripe. That is why only record-level resets are mapped, and why the plain
 * `getStatus` used for fields and observations leaves `reset` uncounted.
 */
const getRecordStatus = (value: unknown): CountableStatus | undefined =>
  getRawStatus(value) === 'reset' ? 'warning' : getStatus(value)

// The API is inconsistent about which of the two it sends, so the row lookup in
// getObservationValidationInfo reads both and so must this.
const getObservationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  const { context } = value as { context?: { observation_id?: string; id?: string } }

  return context?.observation_id ?? context?.id
}

const getValidationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  return (value as { validation_id?: string }).validation_id
}

// ---- Dedup + emit helpers ---------------------------------------------------

// Push a target into its bucket only if an equivalent one isn't already there. The seen set
// keeps the check off the array, which is walked on every keystroke via the dirty check.
const addTarget = (
  targets: NavigationTargets,
  seen: Set<string>,
  status: CountableStatus,
  target: NavigationTarget,
) => {
  const key = `${status}|${target.attribute}|${target.value}`

  if (seen.has(key)) {
    return
  }

  seen.add(key)
  targets[status].push(target)
}

/**
 * Bucket a row by what the form actually shows for it. getValidationsToDisplay owns the
 * precedence (an error hides the rest of the row), so the chips cannot disagree with the
 * badges. A row left showing only resets yields no target, which is right for fields and
 * observations: neither renders anything for a reset.
 */
const emitRowTargets = (
  targets: NavigationTargets,
  seen: Set<string>,
  rowValidations: unknown,
  target: NavigationTarget,
) => {
  for (const validation of getValidationsToDisplay(rowValidations)) {
    const status = getStatus(validation)

    if (status) {
      addTarget(targets, seen, status, target)
    }
  }
}

// ---- Walkers ----------------------------------------------------------------

/**
 * Depth-agnostic descent through a `data.<section>` subtree. A node counts as a
 * "field row" if any of its direct children look like validation leaves (have a
 * countable `status`). Handles three shapes seen in the API:
 *   - deep keyed:    data.sample_event.site.<key>.status
 *   - shallow keyed: data.observers.<key>.status
 *   - array:         data.<section>.<field> = [{ status }]
 *     (post-reset shape — see resetNonObservationFieldValidations in
 *     CollectRecordsMixin, which converts the keyed object into an array).
 */
const walkFieldSubtree = (
  path: string,
  node: unknown,
  targets: NavigationTargets,
  seen: Set<string>,
  isFieldValueDirty: IsFieldValueDirty,
) => {
  if (!node || typeof node !== 'object') {
    return
  }

  const children = Array.isArray(node) ? node : Object.values(node as Record<string, unknown>)

  // Single pass: collect countable statuses of direct children.
  // If any child has one, this node IS the field row.
  const rowStatuses = new Set<CountableStatus>()
  for (const child of children) {
    const status = getStatus(child)
    if (status) {
      rowStatuses.add(status)
    }
  }

  if (rowStatuses.size > 0) {
    // A validation path's last segment is the formik property name for that input, which is
    // also the input's `id`: `data.fishbelt_transect.depth` is edited as `formik.values.depth`
    // and rendered by an input with `id="depth"`. That one name is how a validation is matched
    // to both the value the user is editing and the row to scroll to.
    const formikProperty = path.slice(path.lastIndexOf('.') + 1)

    if (!isFieldValueDirty(formikProperty)) {
      emitRowTargets(targets, seen, node, {
        attribute: 'data-validation-field',
        value: formikProperty,
      })
    }
    return
  }

  // Not a field row — recurse. Arrays here are structural (not part of the semantic
  // path), so children reuse the parent's path; keyed objects extend the path.
  if (Array.isArray(node)) {
    for (const child of node) {
      walkFieldSubtree(path, child, targets, seen, isFieldValueDirty)
    }
    return
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    walkFieldSubtree(`${path}.${key}`, child, targets, seen, isFieldValueDirty)
  }
}

const addRowValidation = (
  validationsByObsId: Map<string, unknown[]>,
  observationId: string,
  validation: unknown,
) => {
  const rowValidations = validationsByObsId.get(observationId) ?? []
  rowValidations.push(validation)
  validationsByObsId.set(observationId, rowValidations)
}

/**
 * Observation-level validations live under `data.obs_*` as nested arrays, outer per
 * observation and inner per validation.
 */
const collectObservationValidations = (
  obsValue: unknown,
  validationsByObsId: Map<string, unknown[]>,
) => {
  if (!Array.isArray(obsValue)) {
    return
  }

  for (const group of obsValue) {
    if (!Array.isArray(group)) {
      continue
    }
    for (const validation of group) {
      const observationId = getObservationId(validation)
      if (observationId) {
        addRowValidation(validationsByObsId, observationId, validation)
      }
    }
  }
}

/**
 * A `duplicate_values` record validation is also rendered on each observation row it names
 * (see getObservationValidationInfo), so it has to join those rows before precedence is
 * applied. A row showing its own error hides the duplicate warning, and must not be counted
 * as one. This is also the only way a row whose sole problem is being a duplicate gets a
 * target, since it has no entry of its own under `data.obs_*`.
 */
const addDuplicateValuesToRows = (
  recordValidations: unknown,
  validationsByObsId: Map<string, unknown[]>,
) => {
  if (!Array.isArray(recordValidations)) {
    return
  }

  for (const validation of recordValidations) {
    for (const observationId of getDuplicateValuesObservationIds(validation)) {
      addRowValidation(validationsByObsId, observationId, validation)
    }
  }
}

// ---- Entry point ------------------------------------------------------------

const getValidationTargets = (
  results: ValidationsResults | undefined,
  isFieldValueDirty: IsFieldValueDirty = () => false,
  observationIdsOnPage: ObservationIdsOnPage = null,
): NavigationTargets => {
  const targets: NavigationTargets = { error: [], warning: [], ignore: [] }
  const seen = new Set<string>()
  if (!results) {
    return targets
  }

  // $record entries are independent rows in the info panel — no grouping.
  if (Array.isArray(results.$record)) {
    for (const validation of getRecordLevelValidationsToDisplay(results.$record)) {
      const status = getRecordStatus(validation)
      const validationId = getValidationId(validation)
      if (status && validationId) {
        addTarget(targets, seen, status, {
          attribute: 'data-record-validation-id',
          value: validationId,
        })
      }
    }
  }

  // `data.obs_*` = observation tables; everything else = form fields. A duplicate_values row
  // has no entry of its own here, so the map is filled even when `data` is missing entirely.
  const validationsByObsId = new Map<string, unknown[]>()

  if (results.data && typeof results.data === 'object') {
    for (const [section, sectionValue] of Object.entries(results.data as Record<string, unknown>)) {
      if (section.startsWith('obs_')) {
        collectObservationValidations(sectionValue, validationsByObsId)
      } else {
        walkFieldSubtree(`data.${section}`, sectionValue, targets, seen, isFieldValueDirty)
      }
    }
  }

  addDuplicateValuesToRows(results.$record, validationsByObsId)

  for (const [observationId, rowValidations] of validationsByObsId) {
    if (observationIdsOnPage && !observationIdsOnPage.has(observationId)) {
      continue
    }

    emitRowTargets(targets, seen, rowValidations, {
      attribute: 'data-observation-id',
      value: observationId,
    })
  }

  return targets
}

export default getValidationTargets

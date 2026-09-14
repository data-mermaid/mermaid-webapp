import type { ValidationStatus } from '../../../../types/constants'
import getRecordLevelValidationsToDisplay from '../getRecordLevelValidationsToDisplay'

/**
 * Enumerates the DOM rows the FormStatusIndicators bar can navigate to.
 *
 * A "target" is a place on the page the user can jump to for a specific
 * validation type. Three kinds:
 *   - record      → an individual <li> in the record-level info panel
 *   - field       → a row in the sample event / transect / observers section
 *   - observation → a row in one of the observation tables
 *
 * Per-row rules:
 *   - N validations of the same status on one row → 1 target (dedup by kind + id).
 *   - error preempts warning/ignore on the same row (matches getValidationsToDisplay
 *     in the input rendering path — a row that shows an error inline should not
 *     also count as a warning/ignore in the chip totals).
 *
 * $record entries are NOT grouped — each renders as its own <li>, so each becomes
 * its own target regardless of status.
 */

// ---- Types ------------------------------------------------------------------

interface ValidationsResults {
  $record?: unknown
  data?: unknown
}

interface RecordTarget {
  kind: 'record'
  validationId: string
}

interface FieldTarget {
  kind: 'field'
  formikProperty: string
}

interface ObservationTarget {
  kind: 'observation'
  observationId: string
}

type NavigationTarget = RecordTarget | FieldTarget | ObservationTarget

interface NavigationTargets {
  error: NavigationTarget[]
  warning: NavigationTarget[]
  ignored: NavigationTarget[]
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

const getObservationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  return (value as { context?: { observation_id?: string } }).context?.observation_id
}

const getValidationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }
  return (value as { validation_id?: string }).validation_id
}

// ---- Dedup + emit helpers ---------------------------------------------------

// bucket key is 'ignored' but status is 'ignore' — small remap
const bucketKeyByStatus: Record<CountableStatus, keyof NavigationTargets> = {
  error: 'error',
  warning: 'warning',
  ignore: 'ignored',
}

const targetsEqual = (a: NavigationTarget, b: NavigationTarget): boolean => {
  if (a.kind === 'record' && b.kind === 'record') {
    return a.validationId === b.validationId
  }
  if (a.kind === 'field' && b.kind === 'field') {
    return a.formikProperty === b.formikProperty
  }
  if (a.kind === 'observation' && b.kind === 'observation') {
    return a.observationId === b.observationId
  }
  return false
}

// Push a target into its bucket only if an equivalent one isn't already there.
const addTarget = (
  targets: NavigationTargets,
  status: CountableStatus,
  target: NavigationTarget,
) => {
  const bucket = targets[bucketKeyByStatus[status]]
  if (!bucket.some((existing) => targetsEqual(existing, target))) {
    bucket.push(target)
  }
}

// Emit one target for a row that carries one-or-more countable statuses.
// Error preempts warning/ignore on the same row.
const emitRowTargets = (
  targets: NavigationTargets,
  rowStatuses: Set<CountableStatus>,
  target: NavigationTarget,
) => {
  if (rowStatuses.has('error')) {
    addTarget(targets, 'error', target)
    return
  }
  if (rowStatuses.has('warning')) {
    addTarget(targets, 'warning', target)
  }
  if (rowStatuses.has('ignore')) {
    addTarget(targets, 'ignore', target)
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
      emitRowTargets(targets, rowStatuses, { kind: 'field', formikProperty })
    }
    return
  }

  // Not a field row — recurse. Arrays here are structural (not part of the semantic
  // path), so children reuse the parent's path; keyed objects extend the path.
  if (Array.isArray(node)) {
    for (const child of node) {
      walkFieldSubtree(path, child, targets, isFieldValueDirty)
    }
    return
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    walkFieldSubtree(`${path}.${key}`, child, targets, isFieldValueDirty)
  }
}

/**
 * Observation-level validations live under `data.obs_*` as nested arrays
 * (outer per observation, inner per validation). Group statuses by observation_id
 * first, then emit one target per row with error-preempts-warning/ignore applied.
 */
const collectObservationTargets = (obsValue: unknown, targets: NavigationTargets) => {
  if (!Array.isArray(obsValue)) {
    return
  }

  const statusesByObsId = new Map<string, Set<CountableStatus>>()
  for (const group of obsValue) {
    if (!Array.isArray(group)) {
      continue
    }
    for (const validation of group) {
      const status = getStatus(validation)
      const observationId = getObservationId(validation)
      if (!status || !observationId) {
        continue
      }
      let rowStatuses = statusesByObsId.get(observationId)
      if (!rowStatuses) {
        rowStatuses = new Set()
        statusesByObsId.set(observationId, rowStatuses)
      }
      rowStatuses.add(status)
    }
  }

  for (const [observationId, rowStatuses] of statusesByObsId) {
    emitRowTargets(targets, rowStatuses, { kind: 'observation', observationId })
  }
}

// ---- Entry point ------------------------------------------------------------

const getValidationTargets = (
  results: ValidationsResults | undefined,
  isFieldValueDirty: IsFieldValueDirty = () => false,
): NavigationTargets => {
  const targets: NavigationTargets = { error: [], warning: [], ignored: [] }
  if (!results) {
    return targets
  }

  // $record entries are independent rows in the info panel — no grouping.
  if (Array.isArray(results.$record)) {
    for (const validation of getRecordLevelValidationsToDisplay(results.$record)) {
      const status = getRecordStatus(validation)
      const validationId = getValidationId(validation)
      if (status && validationId) {
        addTarget(targets, status, { kind: 'record', validationId })
      }
    }
  }

  if (!results.data || typeof results.data !== 'object') {
    return targets
  }

  // `data.obs_*` = observation tables; everything else = form fields.
  for (const [section, sectionValue] of Object.entries(results.data as Record<string, unknown>)) {
    if (section.startsWith('obs_')) {
      collectObservationTargets(sectionValue, targets)
    } else {
      walkFieldSubtree(`data.${section}`, sectionValue, targets, isFieldValueDirty)
    }
  }

  return targets
}

export default getValidationTargets
export type {
  NavigationTarget,
  NavigationTargets,
  RecordTarget,
  FieldTarget,
  ObservationTarget,
  ValidationsResults,
}

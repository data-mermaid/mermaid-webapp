import type { ValidationStatus } from '../../../../types/constants'

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
  validationPath: string
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

// ---- Type-safe accessors (all cast-y unknown reads live here) ---------------

const isCountableStatus = (status: unknown): status is CountableStatus =>
  status === 'error' || status === 'warning' || status === 'ignore'

const getStatus = (value: unknown): CountableStatus | undefined => {
  if (!value || typeof value !== 'object') {return undefined}
  const status = (value as { status?: ValidationStatus }).status
  return isCountableStatus(status) ? status : undefined
}

const getObservationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {return undefined}
  return (value as { context?: { observation_id?: string } }).context?.observation_id
}

const getValidationId = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {return undefined}
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
  if (a.kind === 'record' && b.kind === 'record') {return a.validationId === b.validationId}
  if (a.kind === 'field' && b.kind === 'field') {return a.validationPath === b.validationPath}
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
  if (rowStatuses.has('warning')) {addTarget(targets, 'warning', target)}
  if (rowStatuses.has('ignore')) {addTarget(targets, 'ignore', target)}
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
const walkFieldSubtree = (path: string, node: unknown, targets: NavigationTargets) => {
  if (!node || typeof node !== 'object') {return}

  const children = Array.isArray(node) ? node : Object.values(node as Record<string, unknown>)

  // Single pass: collect countable statuses of direct children.
  // If any child has one, this node IS the field row.
  const rowStatuses = new Set<CountableStatus>()
  for (const child of children) {
    const status = getStatus(child)
    if (status) {rowStatuses.add(status)}
  }

  if (rowStatuses.size > 0) {
    emitRowTargets(targets, rowStatuses, { kind: 'field', validationPath: path })
    return
  }

  // Not a field row — recurse. Arrays here are structural (not part of the semantic
  // path), so children reuse the parent's path; keyed objects extend the path.
  if (Array.isArray(node)) {
    for (const child of node) {walkFieldSubtree(path, child, targets)}
    return
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    walkFieldSubtree(`${path}.${key}`, child, targets)
  }
}

/**
 * Observation-level validations live under `data.obs_*` as nested arrays
 * (outer per observation, inner per validation). Group statuses by observation_id
 * first, then emit one target per row with error-preempts-warning/ignore applied.
 */
const collectObservationTargets = (obsValue: unknown, targets: NavigationTargets) => {
  if (!Array.isArray(obsValue)) {return}

  const statusesByObsId = new Map<string, Set<CountableStatus>>()
  for (const group of obsValue) {
    if (!Array.isArray(group)) {continue}
    for (const validation of group) {
      const status = getStatus(validation)
      const observationId = getObservationId(validation)
      if (!status || !observationId) {continue}
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

const getValidationTargets = (results: ValidationsResults | undefined): NavigationTargets => {
  const targets: NavigationTargets = { error: [], warning: [], ignored: [] }
  if (!results) {return targets}

  // $record entries are independent rows in the info panel — no grouping.
  if (Array.isArray(results.$record)) {
    for (const validation of results.$record) {
      const status = getStatus(validation)
      const validationId = getValidationId(validation)
      if (status && validationId) {
        addTarget(targets, status, { kind: 'record', validationId })
      }
    }
  }

  if (!results.data || typeof results.data !== 'object') {return targets}

  // `data.obs_*` = observation tables; everything else = form fields.
  for (const [section, sectionValue] of Object.entries(results.data as Record<string, unknown>)) {
    if (section.startsWith('obs_')) {
      collectObservationTargets(sectionValue, targets)
    } else {
      walkFieldSubtree(`data.${section}`, sectionValue, targets)
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

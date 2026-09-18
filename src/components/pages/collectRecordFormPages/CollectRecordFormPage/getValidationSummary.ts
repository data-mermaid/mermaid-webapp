import type { ValidationStatus } from '../../../../types/constants'
import getRecordLevelValidationsToDisplay from '../getRecordLevelValidationsToDisplay'
import { getValidationsToDisplay } from '../getValidationPropertiesForInput'
import getDuplicateValuesObservationIds, {
  isDuplicateValuesValidation,
} from './getDuplicateValuesObservationIds'

/**
 * Summarises a collect record's validations for the FormStatusIndicators bar: the number on each
 * chip, and the rows that chip's Next button walks through.
 *
 * Counts and targets answer different questions, so they are different numbers:
 *
 *   - A count answers "how much is left to deal with?". It counts every validation message the
 *     form puts on screen, so three warnings on one observation row count as three.
 *   - A target answers "where do I scroll to?". It is one per row, so those same three warnings
 *     share one target.
 *
 * Both sides read getValidationsToDisplay, which owns the rule for what a row shows: only the
 * first error when a row has errors, otherwise every warning and ignore, and nothing at all for
 * a row left with only resets. A chip therefore cannot claim a message the row is not showing.
 *
 * duplicate_values is the one validation that reaches the screen twice, as a record-level
 * message and as a mark on every row it names. It is counted once, at the record level, and
 * still yields a target per row so Next can reach them.
 */

// ---- Types ------------------------------------------------------------------

interface Validation {
  status?: ValidationStatus
  validation_id?: string
  // The API is inconsistent about which of the two it sends, so the row lookup in
  // getObservationValidationInfo reads both and so must this.
  context?: { observation_id?: string; id?: string }
}

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

type CountableStatus = 'error' | 'warning' | 'ignore'

interface ValidationSummary {
  counts: Record<CountableStatus, number>
  targets: Record<CountableStatus, NavigationTarget[]>
}

/**
 * Answers "has the user edited this input since the last validate?", keyed by formik property
 * name. An edited input hides its inline badge, so it has to drop out of the chips too. The
 * caller owns the comparison, so badges and chips stay driven by one rule.
 */
type IsFieldValueDirty = (formikProperty: string) => boolean

/**
 * The observation rows on the page, or null before the tables have loaded. Deleting a row
 * leaves its validations on the record, so a target can outlive the row it names.
 */
type ObservationIdsOnPage = ReadonlySet<string> | null

// ---- Status ------------------------------------------------------------------

// Tolerates anything the walk hands it, including the strings and nulls found inside a
// half-matched subtree.
const getStatus = (validation?: Validation): CountableStatus | undefined => {
  const status = validation?.status

  return status === 'error' || status === 'warning' || status === 'ignore' ? status : undefined
}

/**
 * `reset` means the user un-ticked "Ignore warning". RecordLevelValidationInfo renders such an
 * item as a warning again, so it counts as one. An input renders nothing at all for a reset:
 * no message, no pill, no checkbox, normal row stripe. Hence the two functions.
 */
const getRecordStatus = (validation: Validation): CountableStatus | undefined =>
  validation.status === 'reset' ? 'warning' : getStatus(validation)

// ---- Emit helpers -----------------------------------------------------------

// Push a target into its bucket only if an equivalent one isn't already there.
const addTarget = (bucket: NavigationTarget[], target: NavigationTarget) => {
  const isAlreadyPresent = bucket.some(
    (existing) => existing.attribute === target.attribute && existing.value === target.value,
  )

  if (!isAlreadyPresent) {
    bucket.push(target)
  }
}

/**
 * Add one row of the form: a count for every message it shows, and one target to scroll to.
 */
const addRow = (summary: ValidationSummary, rowValidations: unknown, target: NavigationTarget) => {
  const displayedValidations: Validation[] = getValidationsToDisplay(rowValidations)

  for (const validation of displayedValidations) {
    const status = getStatus(validation)

    if (!status) {
      continue
    }

    addTarget(summary.targets[status], target)

    // A row only ever carries a duplicate_values through the fan-out below, and the record
    // level has already counted it as the single message it is.
    if (!isDuplicateValuesValidation(validation)) {
      summary.counts[status] += 1
    }
  }
}

// ---- Walkers ----------------------------------------------------------------

/**
 * Depth-agnostic descent through a `data.<section>` subtree. A node is a "field row" if any of
 * its direct children look like validation leaves. Handles three shapes seen in the API:
 *   - deep keyed:    data.sample_event.site.<key>.status
 *   - shallow keyed: data.observers.<key>.status
 *   - array:         data.<section>.<field> = [{ status }]
 *     (post-reset shape — see resetNonObservationFieldValidations in CollectRecordsMixin,
 *     which converts the keyed object into an array).
 */
const walkFieldSubtree = (
  path: string,
  node: unknown,
  summary: ValidationSummary,
  isFieldValueDirty: IsFieldValueDirty,
) => {
  if (!node || typeof node !== 'object') {
    return
  }

  const children = (
    Array.isArray(node) ? node : Object.values(node as Record<string, unknown>)
  ) as Validation[]

  if (children.some((child) => getStatus(child))) {
    // A validation path's last segment is the formik property name for that input, which is
    // also the input's `id`: `data.fishbelt_transect.depth` is edited as `formik.values.depth`
    // and rendered by an input with `id="depth"`. That one name is how a validation is matched
    // to both the value the user is editing and the row to scroll to.
    const formikProperty = path.slice(path.lastIndexOf('.') + 1)

    if (!isFieldValueDirty(formikProperty)) {
      addRow(summary, node, { attribute: 'data-validation-field', value: formikProperty })
    }
    return
  }

  // Not a field row — recurse. Arrays here are structural (not part of the semantic
  // path), so children reuse the parent's path; keyed objects extend the path.
  if (Array.isArray(node)) {
    for (const child of node) {
      walkFieldSubtree(path, child, summary, isFieldValueDirty)
    }
    return
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    walkFieldSubtree(`${path}.${key}`, child, summary, isFieldValueDirty)
  }
}

const addRowValidation = (
  validationsByObsId: Map<string, Validation[]>,
  observationId: string,
  validation: Validation,
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
  validationsByObsId: Map<string, Validation[]>,
) => {
  if (!Array.isArray(obsValue)) {
    return
  }

  for (const group of obsValue) {
    if (!Array.isArray(group)) {
      continue
    }
    for (const validation of group as Validation[]) {
      const observationId = validation?.context?.observation_id ?? validation?.context?.id

      if (observationId) {
        addRowValidation(validationsByObsId, observationId, validation)
      }
    }
  }
}

/**
 * `duplicate_values` is rendered on each observation row it names, so it joins those rows
 * before precedence is applied. Appended last, matching the order getObservationValidationInfo
 * builds, so a row's own error stays the one its message shows.
 */
const addDuplicateValuesToRows = (
  recordValidations: unknown,
  validationsByObsId: Map<string, Validation[]>,
) => {
  if (!Array.isArray(recordValidations)) {
    return
  }

  for (const validation of recordValidations as Validation[]) {
    for (const observationId of getDuplicateValuesObservationIds(validation)) {
      addRowValidation(validationsByObsId, observationId, validation)
    }
  }
}

// ---- Entry point ------------------------------------------------------------

const getValidationSummary = (
  results: ValidationsResults | undefined,
  isFieldValueDirty: IsFieldValueDirty = () => false,
  observationIdsOnPage: ObservationIdsOnPage = null,
): ValidationSummary => {
  const summary: ValidationSummary = {
    counts: { error: 0, warning: 0, ignore: 0 },
    targets: { error: [], warning: [], ignore: [] },
  }

  if (!results) {
    return summary
  }

  // $record entries are not grouped. Each renders as its own <li>, so each is one message and
  // one target.
  if (Array.isArray(results.$record)) {
    for (const validation of getRecordLevelValidationsToDisplay<Validation>(results.$record)) {
      const status = getRecordStatus(validation)

      if (!status) {
        continue
      }

      summary.counts[status] += 1

      if (validation.validation_id) {
        addTarget(summary.targets[status], {
          attribute: 'data-record-validation-id',
          value: validation.validation_id,
        })
      }
    }
  }

  // `data.obs_*` = observation tables; everything else = form fields. A duplicate_values row
  // has no entry here, so the map is still filled when `data` is missing entirely.
  const validationsByObsId = new Map<string, Validation[]>()

  if (results.data && typeof results.data === 'object') {
    for (const [section, sectionValue] of Object.entries(results.data as Record<string, unknown>)) {
      if (section.startsWith('obs_')) {
        collectObservationValidations(sectionValue, validationsByObsId)
      } else {
        walkFieldSubtree(`data.${section}`, sectionValue, summary, isFieldValueDirty)
      }
    }
  }

  addDuplicateValuesToRows(results.$record, validationsByObsId)

  for (const [observationId, rowValidations] of validationsByObsId) {
    if (observationIdsOnPage && !observationIdsOnPage.has(observationId)) {
      continue
    }

    addRow(summary, rowValidations, { attribute: 'data-observation-id', value: observationId })
  }

  return summary
}

export default getValidationSummary

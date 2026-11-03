import type { ValidationStatus } from '../../../../types/constants'
import type { ValidationContext } from '../../../../types/validation'
import { getMessageColumns, toColumnKey } from '../../../../library/validationMessageHelpers'
import {
  fieldDisclosureKey,
  rowDisclosureKey,
} from '../../../generic/ValidationMessage/ValidationDisclosure'
import getRecordLevelValidationsToDisplay, {
  DRY_SUBMIT_CODE,
} from '../getRecordLevelValidationsToDisplay'
import {
  getValidationsToDisplay,
  isGreyed,
  type RowValidations,
} from '../getValidationPropertiesForInput'
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
 * Both sides read getValidationsToDisplay, which owns the rule for what a row shows: its errors
 * and warnings together, without the errors that only repeat an empty required cell. A chip
 * therefore cannot claim a message the row is not showing. A greyed message (`isStale`, edited
 * since the last Validate) is shown but is neither counted nor a target.
 *
 * Some record-level messages repeat what the form marks elsewhere. Each is counted and is a
 * target only when nothing else on the page shows it as a live error. A warning, an ignore or a
 * greyed message is not a mark: these summaries are errors, and none of those explains one, so
 * the summary counts again until the next Validate replaces it.
 *
 *   - duplicate_values is also shown on every row it names, and counts once per row on the page.
 *   - The "One or more invalid fields" message (invalid_fishbelt_transect and its siblings) means
 *     the API's duplicate transect check could not read one of its `fields`. It counts only while
 *     none of those fields shows a message.
 *   - unsuccessful_dry_submit ("System validation error") names fields and observation columns
 *     in `context.dry_submit_results`. It counts only while one of them shows no message.
 */

// ---- Types ------------------------------------------------------------------

interface Validation {
  status?: ValidationStatus
  isStale?: boolean
  code?: string
  name?: string
  validation_id?: string
  fields?: string[]
  // The API is inconsistent about whether a row is named by `observation_id` or `id`, so the row
  // lookup in getObservationValidationInfo reads both and so must this.
  context?: ValidationContext | null
}

interface ValidationsResults {
  $record?: unknown
  data?: unknown
}

/**
 * A row to scroll to, named by the data attribute it carries:
 *   - data-record-validation-id, on an <li> in a record-level list
 *   - data-validation-field, on a sample event / transect / observers row. Emitted by the
 *     shared input components from their own id, so no protocol form has to opt in.
 *   - data-observation-id, on a row in an observation table
 *
 * A field or row target also names the field or row for Next to open (see ValidationDisclosure).
 */
interface NavigationTarget {
  attribute: 'data-record-validation-id' | 'data-validation-field' | 'data-observation-id'
  value: string
  disclosureKey?: string
}

type CountableStatus = 'error' | 'warning' | 'ignore'

interface ValidationSummary {
  counts: Record<CountableStatus, number>
  targets: Record<CountableStatus, NavigationTarget[]>
}

/**
 * The observation rows on the page, or null before the tables have loaded. Deleting a row
 * leaves its validations on the record, so a target can outlive the row it names.
 */
type ObservationIdsOnPage = ReadonlySet<string> | null

/**
 * What the fields and rows on the page show, for the record-level messages that repeat them:
 *   - fieldPaths: each field that shows a live error, by validation path
 *   - names: each field that shows a live error, by input id, and each observation column a
 *     live row error marks. The dry submit names both kinds the same way.
 *   - duplicatesOnRows: the duplicate_values validations shown on at least one row
 */
interface PageMarks {
  fieldPaths: Set<string>
  names: Set<string>
  duplicatesOnRows: Set<Validation>
}

// The "One or more invalid fields" message, one code per transect type.
const TRANSECT_CHECK_CODES = new Set([
  'invalid_benthic_transect',
  'invalid_fishbelt_transect',
  'invalid_invert_belt_transect',
  'invalid_quadrat_collection',
  'invalid_quadrat_transect',
])

// ---- Status ------------------------------------------------------------------

// Tolerates anything the walk hands it, including the strings and nulls found inside a
// half-matched subtree.
const getStatus = (validation?: Validation): CountableStatus | undefined => {
  const status = validation?.status

  return status === 'error' || status === 'warning' || status === 'ignore' ? status : undefined
}

const isLiveError = (validation: Validation) =>
  validation.status === 'error' && !isGreyed(validation)

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
 * Add one row of the form: a count for every live message it shows, and one target to scroll
 * to. Returns every message it shows, greyed ones included.
 */
const addRow = (
  summary: ValidationSummary,
  rowValidations: unknown,
  target: NavigationTarget,
): Validation[] => {
  const displayedValidations: Validation[] = getValidationsToDisplay(
    rowValidations as RowValidations,
  )

  for (const validation of displayedValidations) {
    const status = getStatus(validation)

    if (!status || isGreyed(validation)) {
      continue
    }

    addTarget(summary.targets[status], target)
    summary.counts[status] += 1
  }

  return displayedValidations
}

// ---- Walkers ----------------------------------------------------------------

/**
 * Depth-agnostic descent through a `data.<section>` subtree. A node is a "field row" if any of
 * its direct children look like validation leaves. Handles three shapes seen in the API:
 *   - deep keyed:    data.sample_event.site.<key>.status
 *   - shallow keyed: data.observers.<key>.status
 *   - array:         data.<section>.<field> = [{ status }], the shape the switchboard writes
 *     back after an ignore or an edit (see _mapFieldValidations in CollectRecordsMixin).
 */
const walkFieldSubtree = (
  path: string,
  node: unknown,
  summary: ValidationSummary,
  marks: PageMarks,
) => {
  if (!node || typeof node !== 'object') {
    return
  }

  const children = (
    Array.isArray(node) ? node : Object.values(node as Record<string, unknown>)
  ) as Validation[]

  if (children.some((child) => getStatus(child))) {
    // A validation path's last segment is the input's `id`: `data.fishbelt_transect.depth` is
    // rendered by an input with `id="depth"`, which is the row to scroll to.
    const inputId = path.slice(path.lastIndexOf('.') + 1)
    const displayedValidations = addRow(summary, node, {
      attribute: 'data-validation-field',
      value: inputId,
      disclosureKey: fieldDisclosureKey(path),
    })

    if (displayedValidations.some(isLiveError)) {
      marks.fieldPaths.add(path)
      marks.names.add(inputId)
    }
    return
  }

  // Not a field row — recurse. Arrays here are structural (not part of the semantic
  // path), so children reuse the parent's path; keyed objects extend the path.
  if (Array.isArray(node)) {
    for (const child of node) {
      walkFieldSubtree(path, child, summary, marks)
    }
    return
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    walkFieldSubtree(`${path}.${key}`, child, summary, marks)
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
 * before the display rule is applied. Appended last, matching the order
 * getObservationValidationInfo builds, so a row's own messages list before the duplicate.
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

// Whether every field and column the dry submit summary names already shows a message. A
// summary that names nothing (an empty or missing `dry_submit_results`) is not shown elsewhere.
const isDrySubmitShownElsewhere = (validation: Validation, marks: PageMarks) => {
  const names = Object.keys(validation.context?.dry_submit_results ?? {})

  return names.length > 0 && names.every((name) => marks.names.has(toColumnKey(name)))
}

const isShownElsewhere = (validation: Validation, marks: PageMarks) => {
  if (TRANSECT_CHECK_CODES.has(validation.code ?? '')) {
    return (validation.fields ?? []).some((path) => marks.fieldPaths.has(path))
  }
  if (validation.code === DRY_SUBMIT_CODE) {
    return isDrySubmitShownElsewhere(validation, marks)
  }

  return marks.duplicatesOnRows.has(validation)
}

// ---- Entry point ------------------------------------------------------------

const getValidationSummary = (
  results: ValidationsResults | undefined,
  observationIdsOnPage: ObservationIdsOnPage = null,
): ValidationSummary => {
  const summary: ValidationSummary = {
    counts: { error: 0, warning: 0, ignore: 0 },
    targets: { error: [], warning: [], ignore: [] },
  }

  if (!results) {
    return summary
  }

  const marks: PageMarks = { fieldPaths: new Set(), names: new Set(), duplicatesOnRows: new Set() }

  // `data.obs_*` = observation tables; everything else = form fields. A duplicate_values row
  // has no entry here, so the map is still filled when `data` is missing entirely.
  const validationsByObsId = new Map<string, Validation[]>()

  if (results.data && typeof results.data === 'object') {
    for (const [section, sectionValue] of Object.entries(results.data as Record<string, unknown>)) {
      if (section.startsWith('obs_')) {
        collectObservationValidations(sectionValue, validationsByObsId)
      } else {
        walkFieldSubtree(`data.${section}`, sectionValue, summary, marks)
      }
    }
  }

  addDuplicateValuesToRows(results.$record, validationsByObsId)

  for (const [observationId, rowValidations] of validationsByObsId) {
    if (observationIdsOnPage && !observationIdsOnPage.has(observationId)) {
      continue
    }

    const displayedValidations = addRow(summary, rowValidations, {
      attribute: 'data-observation-id',
      value: observationId,
      disclosureKey: rowDisclosureKey(observationId),
    })

    for (const validation of displayedValidations) {
      if (isDuplicateValuesValidation(validation)) {
        marks.duplicatesOnRows.add(validation)
      } else if (isLiveError(validation)) {
        getMessageColumns(validation).forEach((column) => marks.names.add(column))
      }
    }
  }

  // Last, because whether a record-level message counts depends on what the fields and rows
  // show. Each one renders as its own <li>, so each is one message and one target. Targets are
  // ordered by page position when Next runs, so the order they are added in doesn't matter.
  if (Array.isArray(results.$record)) {
    for (const validation of getRecordLevelValidationsToDisplay<Validation>(results.$record)) {
      const status = getStatus(validation)

      if (!status || isShownElsewhere(validation, marks)) {
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

  return summary
}

export default getValidationSummary

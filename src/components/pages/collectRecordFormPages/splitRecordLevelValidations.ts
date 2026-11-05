import getRecordLevelValidationsToDisplay from './getRecordLevelValidationsToDisplay'

// A record-level validation about an observation table names that table in `fields` with a
// `data.obs_` prefix, one per protocol (`data.obs_benthic_lits`, `data.obs_belt_fishes`).
// The trailing underscore matters: it stops `data.observers`, a form field, from matching.
const OBSERVATION_FIELD_PREFIX = 'data.obs_'

interface SplitRecordLevelValidations<T> {
  top: T[]
  byTable: Record<string, T[]>
}

/**
 * Decides where each record-level validation renders: under the heading of the observation
 * table it is about, or at the top of the form.
 *
 * `tableNames` lists the record's observation tables in page order. A validation naming a
 * table the record doesn't have goes to the first table, because some API validators name the
 * wrong table (the benthic LIT total length check names `data.obs_benthic_pits`).
 *
 * The display filter runs before the split: its "hide the dry submit summary while another
 * error shows" rule has to see the errors that end up under a table heading too.
 */
const splitRecordLevelValidations = <T extends { fields?: string[] }>(
  validations: readonly T[],
  tableNames: readonly string[],
): SplitRecordLevelValidations<T> => {
  const split: SplitRecordLevelValidations<T> = { top: [], byTable: {} }

  for (const validation of getRecordLevelValidationsToDisplay(validations)) {
    const namedTables = (validation.fields ?? [])
      .filter((field) => field.startsWith(OBSERVATION_FIELD_PREFIX))
      .map((field) => field.slice('data.'.length))
    const table = namedTables.length
      ? (namedTables.find((name) => tableNames.includes(name)) ?? tableNames[0])
      : undefined

    if (table) {
      split.byTable[table] = [...(split.byTable[table] ?? []), validation]
    } else {
      split.top.push(validation)
    }
  }

  return split
}

export default splitRecordLevelValidations

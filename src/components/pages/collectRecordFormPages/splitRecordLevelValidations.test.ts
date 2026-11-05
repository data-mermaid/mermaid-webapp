import { expect, test } from 'vitest'
import splitRecordLevelValidations from './splitRecordLevelValidations'

const tooFew = {
  code: 'too_few_observations',
  status: 'warning',
  fields: ['data.obs_belt_fishes'],
}
const lowDensity = { code: 'low_density', status: 'warning', fields: ['data.obs_belt_fishes'] }
const duplicateValues = {
  code: 'duplicate_values',
  status: 'error',
  fields: ['data.obs_belt_fishes'],
}
const drySubmit = { code: 'unsuccessful_dry_submit', status: 'error', fields: ['__all__'] }
const duplicateTransect = {
  code: 'duplicate_fishbelt_transect',
  status: 'error',
  fields: ['data.fishbelt_transect.number', 'data.sample_event.site'],
}
const similarDate = {
  code: 'similar_date_sample_unit',
  status: 'warning',
  fields: ['data.sample_event.sample_date'],
}
const duplicateImages = { code: 'duplicate_images', status: 'warning', fields: [] }
const observersOnly = { code: 'some_code', status: 'warning', fields: ['data.observers'] }

test.each([
  ['the dry submit summary', drySubmit],
  ['a duplicate sample unit', duplicateTransect],
  ['a similar date warning', similarDate],
  ['a validation with empty fields', duplicateImages],
  ['a validation about data.observers', observersOnly],
])('keeps %s at the top', (_, validation) => {
  expect(splitRecordLevelValidations([validation], ['obs_belt_fishes'])).toEqual({
    top: [validation],
    byTable: {},
  })
})

test('puts every validation that names the table under it, in order', () => {
  expect(
    splitRecordLevelValidations(
      [tooFew, duplicateTransect, lowDensity, duplicateValues],
      ['obs_belt_fishes'],
    ),
  ).toEqual({
    top: [duplicateTransect],
    byTable: { obs_belt_fishes: [tooFew, lowDensity, duplicateValues] },
  })
})

test('sends each bleaching validation to the table it names', () => {
  const colonies = { code: 'exceed_total_colonies', fields: ['data.obs_colonies_bleached'] }
  const percent = { code: 'all_equal', fields: ['data.obs_quadrat_benthic_percent'] }

  expect(
    splitRecordLevelValidations(
      [percent, colonies],
      ['obs_colonies_bleached', 'obs_quadrat_benthic_percent'],
    ).byTable,
  ).toEqual({ obs_colonies_bleached: [colonies], obs_quadrat_benthic_percent: [percent] })
})

test('sends a validation naming a table the record does not have to the first table', () => {
  const litTotalLength = {
    code: 'obs_total_length_toosmall',
    status: 'warning',
    fields: ['data.obs_benthic_pits'],
  }

  expect(splitRecordLevelValidations([litTotalLength], ['obs_benthic_lits']).byTable).toEqual({
    obs_benthic_lits: [litTotalLength],
  })
})

test('an error under a table heading still hides the dry submit summary', () => {
  expect(splitRecordLevelValidations([drySubmit, duplicateValues], ['obs_belt_fishes'])).toEqual({
    top: [],
    byTable: { obs_belt_fishes: [duplicateValues] },
  })
})

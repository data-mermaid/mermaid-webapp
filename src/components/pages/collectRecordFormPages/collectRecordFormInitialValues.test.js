import {
  getBenthicPitAdditionalValues,
  getHabitatComplexityAdditionalValues,
} from './collectRecordFormInitialValues'

const getIsChecked = (data) => getBenthicPitAdditionalValues({ data }).is_interval_size_as_start

describe('getBenthicPitAdditionalValues is_interval_size_as_start', () => {
  test('defaults to checked for a new record', () => {
    expect(getIsChecked(undefined)).toBe(true)
  })

  test('is unchecked when an ingested record has a start that differs from the size', () => {
    expect(getIsChecked({ interval_size: 0.25, interval_start: 0 })).toBe(false)
  })

  test('is unchecked when the flag is true but start and size differ', () => {
    expect(
      getIsChecked({ interval_size: 0.25, interval_start: 0, is_interval_size_as_start: true }),
    ).toBe(false)
  })

  test('is checked when start and size match', () => {
    expect(getIsChecked({ interval_size: 0.25, interval_start: 0.25 })).toBe(true)
    expect(getIsChecked({ interval_size: '0.25', interval_start: 0.25 })).toBe(true)
  })

  test('keeps the stored flag when either value is empty', () => {
    expect(getIsChecked({ interval_size: 0.25, interval_start: '' })).toBe(true)
    expect(getIsChecked({ interval_size: '', interval_start: 0 })).toBe(true)
    expect(getIsChecked({ interval_size: 0.25, is_interval_size_as_start: false })).toBe(false)
  })

  test('stays unchecked when the user unchecked it, even if values match', () => {
    expect(
      getIsChecked({ interval_size: 1, interval_start: 1, is_interval_size_as_start: false }),
    ).toBe(false)
  })
})

describe('getHabitatComplexityAdditionalValues is_interval_size_as_start', () => {
  const getIsHabitatComplexityChecked = (data) =>
    getHabitatComplexityAdditionalValues({ data }).is_interval_size_as_start

  test('defaults to checked for a new record', () => {
    expect(getIsHabitatComplexityChecked(undefined)).toBe(true)
  })

  test('is unchecked when an ingested record has a start that differs from the size', () => {
    expect(getIsHabitatComplexityChecked({ interval_size: 0.25, interval_start: 0 })).toBe(false)
  })

  test('is checked when start and size match', () => {
    expect(getIsHabitatComplexityChecked({ interval_size: 0.25, interval_start: 0.25 })).toBe(true)
  })
})

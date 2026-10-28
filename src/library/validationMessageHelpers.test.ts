import type { ReactElement } from 'react'
import { describe, expect, test, vi } from 'vitest'
import i18n from '../../i18n'
import en from '../locales/en/translation.json'
import { getValidationMessage } from './validationMessageHelpers'

describe('getValidationMessage for required', () => {
  test('names the observation column the API validator name carries', () => {
    expect(getValidationMessage({ code: 'required', name: 'size_list_required_validator' })).toBe(
      'validation_messages.required_size',
    )
    expect(
      getValidationMessage({ code: 'required', name: 'fish_attribute_list_required_validator' }),
    ).toBe('validation_messages.required_fish_name')
  })

  test('stays plain for a form field, whose validator name has no column', () => {
    expect(getValidationMessage({ code: 'required', name: 'required_validator' })).toBe(
      'validation_messages.required',
    )
  })

  test('stays plain when the validation has no name', () => {
    expect(getValidationMessage({ code: 'required' })).toBe('validation_messages.required')
  })

  test('size_bin_required asks for the size bin, which is what is missing', () => {
    expect(getValidationMessage({ code: 'size_bin_required' })).toBe(
      'validation_messages.size_bin_required',
    )
  })
})

describe('getValidationMessage for ranges and thresholds', () => {
  test('sample time shows its range without seconds', () => {
    const tSpy = vi.spyOn(i18n, 't')

    getValidationMessage({
      code: 'sample_time_out_of_range',
      context: { time_range: ['06:00:00', '19:00:00'] },
    })

    expect(tSpy).toHaveBeenCalledWith('validation_messages.outside_of_range', {
      min: '06:00',
      max: '19:00',
    })
  })

  test('transect length shows its range', () => {
    const tSpy = vi.spyOn(i18n, 't')

    getValidationMessage({
      code: 'len_surveyed_out_of_range',
      context: { len_surveyed_range: [1, 999] },
    })

    expect(tSpy).toHaveBeenCalledWith('validation_messages.outside_of_range', { min: 1, max: 999 })
  })

  test('both depth codes share one message naming the maximum', () => {
    const tSpy = vi.spyOn(i18n, 't')

    getValidationMessage({ code: 'invalid_depth', context: { depth_range: [0, 40] } })
    getValidationMessage({ code: 'max_depth', context: { depth_range: [0, 40] } })

    expect(tSpy).toHaveBeenNthCalledWith(1, 'validation_messages.depth_out_of_range', { max: 40 })
    expect(tSpy).toHaveBeenNthCalledWith(2, 'validation_messages.depth_out_of_range', { max: 40 })
  })

  test('threshold codes use the zero messages from the audit sheet', () => {
    expect(getValidationMessage({ code: 'invalid_interval_start' })).toBe(
      'validation_messages.zero_or_greater',
    )
    expect(getValidationMessage({ code: 'not_positive_integer' })).toBe(
      'validation_messages.zero_or_greater',
    )
    expect(getValidationMessage({ code: 'invalid_interval_size' })).toBe(
      'validation_messages.size_greater_than_zero',
    )
    expect(getValidationMessage({ code: 'invalid_quadrat_size' })).toBe(
      'validation_messages.size_greater_than_zero',
    )
  })
})

describe('getValidationMessage for observation counts and renamed messages', () => {
  test('observation count messages name the bound that was crossed', () => {
    const tSpy = vi.spyOn(i18n, 't')
    const context = { observation_count_range: [5, 200] as [number, number] }

    getValidationMessage({ code: 'too_few_observations', context })
    getValidationMessage({ code: 'too_many_observations', context })

    expect(tSpy).toHaveBeenCalledWith('validation_messages.too_few_observations', { min: 5 })
    expect(tSpy).toHaveBeenCalledWith('validation_messages.too_many_observations', { max: 200 })
  })

  test('observation row thresholds name the count column', () => {
    expect(getValidationMessage({ code: 'invalid_fish_count' })).toBe(
      'validation_messages.count_zero_or_greater',
    )
    expect(getValidationMessage({ code: 'invalid_invert_count' })).toBe(
      'validation_messages.count_greater_than_zero',
    )
  })

  test('maximums name the limit the API sends. Quadrat size rejects the limit itself', () => {
    const tSpy = vi.spyOn(i18n, 't')

    getValidationMessage({ code: 'max_interval_size', context: { interval_size_range: [0, 10] } })
    getValidationMessage({ code: 'max_interval_start', context: { interval_start_range: [0, 10] } })
    getValidationMessage({ code: 'max_quadrat_size', context: { quadrat_size_range: [0, 10] } })

    expect(tSpy).toHaveBeenNthCalledWith(1, 'validation_messages.maximum_metres', { max: 10 })
    expect(tSpy).toHaveBeenNthCalledWith(2, 'validation_messages.maximum_metres', { max: 10 })
    expect(tSpy).toHaveBeenNthCalledWith(3, 'validation_messages.less_than_square_metres', {
      max: 10,
    })
  })

  test('depth precision names the number of decimal places', () => {
    const tSpy = vi.spyOn(i18n, 't')

    getValidationMessage({ code: 'excessive_precision', context: { decimal_places: 1 } })

    expect(tSpy).toHaveBeenCalledWith('validation_messages.decimal_places_exceeded', { count: 1 })
  })

  test('renamed messages point at their new keys', () => {
    expect(getValidationMessage({ code: 'invalid_fish_size' })).toBe(
      'validation_messages.invalid_size',
    )
    expect(getValidationMessage({ code: 'max_fish_size' })).toBe(
      'validation_messages.size_larger_than_maximum_observed',
    )
    expect(getValidationMessage({ code: 'diff_num_images' })).toBe(
      'validation_messages.quadrat_count_differs_from_photos',
    )
    expect(getValidationMessage({ code: 'unconfirmed_annotation' })).toBe(
      'validation_messages.unconfirmed_annotation',
    )
    expect(getValidationMessage({ code: 'site_not_found' })).toBe(
      'validation_messages.site_not_found_short',
    )
    expect(getValidationMessage({ code: 'future_sample_date' })).toBe(
      'validation_messages.date_in_future',
    )
    expect(getValidationMessage({ code: 'implausibly_old_date' })).toBe(
      'validation_messages.date_before_1900',
    )
    expect(getValidationMessage({ code: 'invert_count_high' })).toBe(
      'validation_messages.count_unusually_high',
    )
    expect(getValidationMessage({ code: 'invert_size_exceeds_maximum' })).toBe(
      'validation_messages.size_larger_than_maximum_expected',
    )
  })
})

describe('getValidationMessage for duplicate sample units', () => {
  test('a duplicate macroinvertebrate transect links to the submitted one', () => {
    const message = getValidationMessage(
      {
        code: 'duplicate_invert_belt_transect',
        context: { duplicate_transect_method: 'su-1', protocol: 'macroinvertebrate' },
      },
      'project-1',
    ) as ReactElement<{ components: { a: ReactElement<{ href: string }> } }>

    expect(message.props.components.a.props.href).toBe(
      '/projects/project-1/submitted/macroinvertebrate/su-1',
    )
  })
})

// Tests run i18n in cimode, which echoes any key back, so a key missing from the English file
// would pass every test above and still render as a raw key. This reads the keys straight from
// the source instead.
const helperSource = Object.values(
  import.meta.glob<string>('./validationMessageHelpers.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
)[0]

test('every validation message key the helper uses exists in the English translations', () => {
  const usedKeys = [...helperSource.matchAll(/'validation_messages\.([a-z0-9_]+)'/g)].map(
    ([, key]) => key,
  )
  const englishKeys = Object.keys(en.validation_messages)
  const missing = usedKeys.filter(
    (key) => !englishKeys.includes(key) && !englishKeys.includes(`${key}_one`),
  )

  expect(usedKeys.length).toBeGreaterThan(50)
  expect(missing).toEqual([])
})

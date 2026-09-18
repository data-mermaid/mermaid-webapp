import { describe, expect, test, vi } from 'vitest'
import i18n from '../../i18n'
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

  test('size_bin_required reads as the size column being required', () => {
    expect(getValidationMessage({ code: 'size_bin_required' })).toBe(
      'validation_messages.required_size',
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

    expect(tSpy).toHaveBeenCalledTimes(2)
    expect(tSpy).toHaveBeenCalledWith('validation_messages.depth_out_of_range', { max: 40 })
  })

  test('threshold codes share the two zero messages', () => {
    expect(getValidationMessage({ code: 'invalid_fish_count' })).toBe(
      'validation_messages.zero_or_greater',
    )
    expect(getValidationMessage({ code: 'not_positive_integer' })).toBe(
      'validation_messages.zero_or_greater',
    )
    expect(getValidationMessage({ code: 'invalid_interval_size' })).toBe(
      'validation_messages.greater_than_zero',
    )
    expect(getValidationMessage({ code: 'invalid_quadrat_size' })).toBe(
      'validation_messages.greater_than_zero',
    )
  })
})

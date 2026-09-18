import { describe, expect, test } from 'vitest'
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

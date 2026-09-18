import { describe, expect, test } from 'vitest'
import type { ValidationStatus } from '../../../types/constants'
import type { Validation } from '../../../types/validation'
import getValidationPropertiesForInput, {
  getValidationsToDisplay,
} from './getValidationPropertiesForInput'

const validation = (status: ValidationStatus, code: string): Validation => ({ status, code })

describe('getValidationPropertiesForInput', () => {
  test('keeps the validator name on each message so the text can name the column', () => {
    const required: Validation = {
      status: 'error',
      code: 'required',
      name: 'size_list_required_validator',
      validation_id: 'v1',
      context: { observation_id: 'obs1' },
    }

    expect(getValidationPropertiesForInput([required], true)).toEqual({
      validationType: 'error',
      validationMessages: [
        {
          code: 'required',
          name: 'size_list_required_validator',
          id: 'v1',
          context: { observation_id: 'obs1' },
        },
      ],
    })
  })
})

describe('getValidationsToDisplay', () => {
  test('shows the required error over any other error on the row, whatever the order', () => {
    const invalid = validation('error', 'invalid_fish_count')
    const required = validation('error', 'required')

    expect(getValidationsToDisplay([invalid, required])).toEqual([required])
    expect(getValidationsToDisplay([required, invalid])).toEqual([required])
  })

  test('shows the first error when none of them is required', () => {
    const first = validation('error', 'invalid_depth')
    const second = validation('error', 'excessive_precision')

    expect(getValidationsToDisplay([first, second])).toEqual([first])
  })

  test('an error hides the warnings and ignores on the same row', () => {
    const error = validation('error', 'required')
    const warning = validation('warning', 'max_fish_size')

    expect(getValidationsToDisplay([warning, error])).toEqual([error])
  })

  test('shows warnings and ignores together when there is no error', () => {
    const warning = validation('warning', 'max_fish_size')
    const ignored = validation('ignore', 'not_part_of_fish_family_subset')

    expect(getValidationsToDisplay([warning, ignored])).toEqual([warning, ignored])
  })

  test('shows resets only when the row has nothing else', () => {
    const reset = validation('reset', 'max_fish_size')

    expect(getValidationsToDisplay([reset])).toEqual([reset])
  })
})

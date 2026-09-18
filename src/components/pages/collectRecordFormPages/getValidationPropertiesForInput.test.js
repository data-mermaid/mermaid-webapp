import { describe, expect, test } from 'vitest'
import getValidationPropertiesForInput, {
  getValidationsToDisplay,
} from './getValidationPropertiesForInput'

describe('getValidationPropertiesForInput', () => {
  test('keeps the validator name on each message so the text can name the column', () => {
    const validation = {
      status: 'error',
      code: 'required',
      name: 'size_list_required_validator',
      validation_id: 'v1',
      context: { observation_id: 'obs1' },
    }

    expect(getValidationPropertiesForInput([validation], true)).toEqual({
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
    const invalid = { status: 'error', code: 'invalid_fish_count' }
    const required = { status: 'error', code: 'required' }

    expect(getValidationsToDisplay([invalid, required])).toEqual([required])
    expect(getValidationsToDisplay([required, invalid])).toEqual([required])
  })

  test('shows the first error when none of them is required', () => {
    const first = { status: 'error', code: 'invalid_depth' }
    const second = { status: 'error', code: 'excessive_precision' }

    expect(getValidationsToDisplay([first, second])).toEqual([first])
  })

  test('an error hides the warnings and ignores on the same row', () => {
    const error = { status: 'error', code: 'required' }
    const warning = { status: 'warning', code: 'max_fish_size' }

    expect(getValidationsToDisplay([warning, error])).toEqual([error])
  })

  test('shows warnings and ignores together when there is no error', () => {
    const warning = { status: 'warning', code: 'max_fish_size' }
    const ignored = { status: 'ignore', code: 'not_part_of_fish_family_subset' }

    expect(getValidationsToDisplay([warning, ignored])).toEqual([warning, ignored])
  })

  test('shows resets only when the row has nothing else', () => {
    const reset = { status: 'reset', code: 'max_fish_size' }

    expect(getValidationsToDisplay([reset])).toEqual([reset])
  })
})

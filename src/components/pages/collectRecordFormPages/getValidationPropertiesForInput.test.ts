import { describe, expect, test } from 'vitest'
import type { ValidationStatus } from '../../../types/constants'
import type { Validation } from '../../../types/validation'
import getValidationPropertiesForInput, {
  getValidationsToDisplay,
} from './getValidationPropertiesForInput'

const validation = (status: ValidationStatus, code: string, name?: string): Validation => ({
  status,
  code,
  name,
})
const rowRequired = (column: string) =>
  validation('error', 'required', `${column}_list_required_validator`)

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
          status: 'error',
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
  test('a field shows only its required error, whatever the order', () => {
    const invalid = validation('error', 'invalid_fish_count')
    const required = validation('error', 'required')

    expect(getValidationsToDisplay([invalid, required])).toEqual([required])
    expect(getValidationsToDisplay([required, invalid])).toEqual([required])
  })

  test('shows every error when none of them is required', () => {
    const first = validation('error', 'invalid_depth')
    const second = validation('error', 'excessive_precision')

    expect(getValidationsToDisplay([first, second])).toEqual([first, second])
  })

  test("shows a row's warnings and ignores alongside its errors, errors first", () => {
    const error = rowRequired('count')
    const warning = validation('warning', 'max_fish_size')
    const ignored = validation('ignore', 'no_region_match')

    expect(getValidationsToDisplay([warning, error, ignored])).toEqual([error, warning, ignored])
  })

  test('shows every empty required cell on a row', () => {
    const size = rowRequired('size')
    const count = rowRequired('count')

    expect(getValidationsToDisplay([size, count])).toEqual([size, count])
  })

  test("hides only the errors the API also raises for a row's empty cell", () => {
    const required = rowRequired('count')
    const emptyCount = validation('error', 'invalid_fish_count')
    const otherCell = validation('error', 'invalid_fish_size')
    const unmapped = validation('error', 'invalid_count')

    expect(getValidationsToDisplay([emptyCount, required, otherCell, unmapped])).toEqual([
      required,
      otherCell,
      unmapped,
    ])
  })

  test('shows warnings and ignores together when there is no error', () => {
    const warning = validation('warning', 'max_fish_size')
    const ignored = validation('ignore', 'not_part_of_fish_family_subset')

    expect(getValidationsToDisplay([warning, ignored])).toEqual([warning, ignored])
  })

  test('hides site not found on the management field, which the site field already reports', () => {
    const siteNotFound: Validation = {
      status: 'error',
      code: 'site_not_found',
      fields: ['data.sample_event.management'],
    }

    expect(getValidationsToDisplay([siteNotFound])).toEqual([])
  })

  test('keeps site not found on the site field, where it is the only report of a missing site', () => {
    const siteNotFound: Validation = {
      status: 'error',
      code: 'site_not_found',
      fields: ['data.sample_event.site'],
    }

    expect(getValidationsToDisplay([siteNotFound])).toEqual([siteNotFound])
  })

  test('keeps a greyed message in its place, so an edited row still shows it', () => {
    const staleError = { ...validation('error', 'invalid_depth'), isStale: true }
    const warning = validation('warning', 'max_depth')

    expect(getValidationsToDisplay([warning, staleError])).toEqual([staleError, warning])
  })
})

describe('getValidationPropertiesForInput colour', () => {
  const staleError = { ...validation('error', 'invalid_depth'), isStale: true }

  test('is the first live message, so a greyed error does not colour the field', () => {
    const { validationType, validationMessages } = getValidationPropertiesForInput(
      [staleError, validation('warning', 'max_depth')],
      true,
    )

    expect(validationType).toBe('warning')
    expect(validationMessages?.map(({ isStale }) => isStale)).toEqual([true, undefined])
  })

  test('is info when every message is greyed', () => {
    expect(getValidationPropertiesForInput([staleError], true).validationType).toBe('info')
  })
})

import { expect, test } from 'vitest'
import en from './en/translation.json'

// Lokalise reads a key ending in an i18next plural suffix as one form of a plural key. A lone
// `_zero` key becomes a plural with no English forms, so the next pull drops it from every
// language. A plural suffix is only safe as part of a group that has the `_other` form.
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/

const getLonePluralKeys = (translations: Record<string, unknown>, path = ''): string[] =>
  Object.entries(translations).flatMap(([key, value]) => {
    const fullKey = path ? `${path}.${key}` : key

    if (value && typeof value === 'object') {
      return getLonePluralKeys(value as Record<string, unknown>, fullKey)
    }

    const isLonePlural =
      PLURAL_SUFFIX.test(key) && !(`${key.replace(PLURAL_SUFFIX, '')}_other` in translations)

    return isLonePlural ? [fullKey] : []
  })

test('no English key ends in a plural suffix unless it belongs to a plural group', () => {
  expect(getLonePluralKeys(en)).toEqual([])
})

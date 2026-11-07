import { afterAll, expect, test, vi } from 'vitest'

// src/setupTests.js replaces '../i18n' with a bare i18next instance for every test, so the real
// module and its languageChanged listener are only reachable through importActual.
const loadRealI18n = async () => {
  const actual = (await vi.importActual('./i18n')) as {
    default: { changeLanguage: (language: string) => Promise<unknown> }
  }

  return actual.default
}

afterAll(() => {
  document.documentElement.lang = 'en'
})

test('document language follows the language i18next resolves at init', async () => {
  document.documentElement.lang = ''

  await loadRealI18n()

  // init() is async because locales load through resourcesToBackend. This asserts the listener is
  // registered early enough to catch the initial languageChanged, not only later switches.
  await vi.waitFor(() => expect(document.documentElement.lang).toBe('en'))
})

test('document language follows a language switch', async () => {
  const i18n = await loadRealI18n()

  await i18n.changeLanguage('id')

  expect(document.documentElement.lang).toBe('id')
})

test('cimode is not written to the document language', async () => {
  const i18n = await loadRealI18n()

  await i18n.changeLanguage('id')
  await i18n.changeLanguage('cimode')

  // cimode renders raw translation keys and is not a BCP 47 tag. Leaving the previous valid tag in
  // place beats declaring one a screen reader cannot parse.
  expect(document.documentElement.lang).toBe('id')
})

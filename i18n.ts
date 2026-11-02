import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'

// index.html hardcodes lang="en", so switching to any of the other five locales left the document
// still claiming to be English. Chrome compares that against the detected content language and
// offers to translate on a mismatch, and accepting makes the translator wrap text nodes in <font>
// elements, which moves nodes out from under React and breaks its commit phase
// (MERMAID-WEBAPP-N). Keeping these in sync is also WCAG 3.1.1.
//
// Registered before init() because i18next emits languageChanged for the initial language too, not
// only on later switches.
i18next.on('languageChanged', (language: string) => {
  document.documentElement.lang = language
})

i18next
  .use(
    resourcesToBackend((language: string) => import(`./src/locales/${language}/translation.json`)),
  )
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18next

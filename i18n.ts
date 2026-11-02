import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'

// index.html hardcodes lang="en" and nothing else updated it, so switching language left the
// document misdeclaring itself. That fails WCAG 3.1.1, which changes how a screen reader pronounces
// the page.
//
// Scope is smaller than it looks: LanguageMenuTool only renders when VITE_ENVIRONMENT is not
// production (Header.jsx:124), and no language detector is configured, so production always runs as
// 'en' and this is a no-op there.
//
// Registered before init() because i18next emits languageChanged for the initial language too, not
// only on later switches.
i18next.on('languageChanged', (language: string) => {
  // cimode is i18next's pseudo-language that renders raw keys, offered as "Token QA" in the
  // dev-only menu. It is not a BCP 47 tag, so writing it would leave a screen reader unable to
  // identify the language at all, which is worse than a stale but valid one.
  if (language === 'cimode') {
    return
  }

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

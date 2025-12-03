import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'

i18next
  .use(initReactI18next)
  .use(intervalPlural)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./src/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18next

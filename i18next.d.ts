import 'i18next'
import translation from './src/locales/en/translation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      en: typeof translation
    }
  }
}

import '@testing-library/jest-dom'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(() => Promise.resolve()),
      language: 'en',
      languages: ['en'],
      isInitialized: true,
      exists: jest.fn(() => true),
      getFixedT: jest.fn(() => (key: string) => key),
      hasResourceBundle: jest.fn(() => true),
      loadNamespaces: jest.fn(() => Promise.resolve()),
      loadLanguages: jest.fn(() => Promise.resolve()),
      off: jest.fn(),
      on: jest.fn(),
      emit: jest.fn(),
      store: {},
      services: {},
      options: {},
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import axiosInstance from './library/axiosRetry'

import mockMermaidApiAllSuccessful from './testUtilities/mockMermaidApiAllSuccessful'
import { mockDocumentCookie } from './testUtilities/mockDocumentCookie'

// Disable axios-retry globally in tests to avoid masking failures
axiosInstance.defaults['axios-retry'] = {
  retries: 0,
  retryCondition: () => false,
  retryDelay: () => 0,
}

// jest.mock → vi.mock, and return full export objects
vi.mock('maplibre-gl/dist/maplibre-gl', function mapLibreMock() {
  return {
    Map: function () {
      return {
        addControl: vi.fn(() => ({})),
        dragRotate: { disable: vi.fn() },
        getLayer: vi.fn(),
        jumpTo: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        remove: vi.fn(),
        touchZoomRotate: { disableRotation: vi.fn() },
        getSource: vi.fn(() => ({ setData: vi.fn() })),
        fitBounds: vi.fn(),
        getZoom: vi.fn(),
        getCanvas: vi.fn(() => ({ style: {} })),
      }
    },
    Marker: function () {
      return {
        setLngLat: vi.fn(() => ({ addTo: vi.fn() })),
        on: vi.fn(),
        remove: vi.fn(),
        getElement: vi.fn(() => ({})),
      }
    },
    Popup: function () {
      return {
        setLngLat: vi.fn(() => ({ setDOMContent: vi.fn(() => ({ addTo: vi.fn() })) })),
      }
    },
    LngLatBounds: function () {
      return {
        extend: vi.fn,
      }
    },
    NavigationControl: vi.fn(),
  }
})

// Update react-i18next mock to vi.mock return signature
vi.mock('react-i18next', () => ({
  default: {},
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: vi.fn(() => Promise.resolve()),
      language: 'en',
      languages: ['en'],
      isInitialized: true,
      exists: vi.fn(() => true),
      getFixedT: vi.fn(() => (key) => key),
      hasResourceBundle: vi.fn(() => true),
      loadNamespaces: vi.fn(() => Promise.resolve()),
      loadLanguages: vi.fn(() => Promise.resolve()),
      off: vi.fn(),
      on: vi.fn(),
      emit: vi.fn(),
      store: {},
      services: {},
      options: {},
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
  Trans: ({ children }) => children,
  I18nextProvider: ({ children }) => children,
}))

configure({ asyncUtilTimeout: 10000 })

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
  // import.meta.env works in Vitest via Vite
  global.IS_REACT_ACT_ENVIRONMENT = !!import.meta.env.VITE_IGNORE_TESTING_ACT_WARNINGS // suppress missing act warnings or not, defaults to false
})
beforeEach(() => {
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'default-client-id'
  const auth0CookieName = `auth0.${auth0ClientId}.is.authenticated=true`
  const mockCookie = `_legacy_${auth0CookieName}; ${auth0CookieName};`

  mockDocumentCookie(mockCookie)
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
  window.sessionStorage.clear()
  window.localStorage.clear()
  mockDocumentCookie('')
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

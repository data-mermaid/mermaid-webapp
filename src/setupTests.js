/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import mockMermaidApiAllSuccessful from './testUtilities/mockMermaidApiAllSuccessful'

jest.setTimeout(300000)
window.URL.createObjectURL = () => {}
window.confirm = () => true // simulates user clicking OK
window.scrollTo = () => {}

jest.mock('maplibre-gl/dist/maplibre-gl', function mapLibreMock() {
  return {
    Map: function () {
      return {
        addControl: jest.fn(() => ({})),
        dragRotate: { disable: jest.fn() },
        getLayer: jest.fn(),
        jumpTo: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        remove: jest.fn(),
        touchZoomRotate: { disableRotation: jest.fn() },
        getSource: jest.fn(() => ({ setData: jest.fn() })),
        fitBounds: jest.fn(),
        getZoom: jest.fn(),
        getCanvas: jest.fn(() => ({ style: {} })),
      }
    },
    Marker: function () {
      return {
        setLngLat: jest.fn(() => ({ addTo: jest.fn() })),
        on: jest.fn(),
        remove: jest.fn(),
        getElement: jest.fn(() => ({})),
      }
    },
    Popup: function () {
      return {
        setLngLat: jest.fn(() => ({ setDOMContent: jest.fn(() => ({ addTo: jest.fn() })) })),
      }
    },
    LngLatBounds: function () {
      return {
        extend: jest.fn,
      }
    },
    NavigationControl: jest.fn(),
  }
})

configure({ asyncUtilTimeout: 10000 })

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
  global.IS_REACT_ACT_ENVIRONMENT = !!process.env.REACT_APP_IGNORE_TESTING_ACT_WARNINGS // suppress missing act warnings or not, defaults to false
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
  window.sessionStorage.clear()
  window.localStorage.clear()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

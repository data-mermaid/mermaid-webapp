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

jest.setTimeout(30000)
window.URL.createObjectURL = () => {}

jest.mock('maplibre-gl/dist/maplibre-gl', function foo() {
  return {
    Map: function () {
      return {
        addControl: jest.fn(() => ({})),
        dragRotate: { disable: jest.fn() },
        getLayer: jest.fn(),
        jumpTo: jest.fn(),
        on: jest.fn(),
        remove: jest.fn(),
        touchZoomRotate: { disableRotation: jest.fn() },
      }
    },
    Marker: function () {
      return { setLngLat: jest.fn(() => ({ addTo: jest.fn() })), on: jest.fn(), remove: jest.fn() }
    },
    NavigationControl: jest.fn(),
  }
})

configure({ asyncUtilTimeout: 10000 })

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
  window.sessionStorage.clear()
  window.localStorage.clear()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

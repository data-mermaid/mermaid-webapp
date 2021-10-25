// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import mockMermaidApiAllSuccessful from './testUtilities/mockMermaidApiAllSuccessful'

jest.setTimeout(30000)
window.URL.createObjectURL = () => {}

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

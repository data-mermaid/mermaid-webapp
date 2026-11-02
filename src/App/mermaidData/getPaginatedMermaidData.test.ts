import { expect, test } from 'vitest'
import { getPaginatedMermaidData } from './getPaginatedMermaidData'

const failingAxios = {
  get: async () => {
    throw new Error('Network Error')
  },
}

const pagedAxios = {
  get: async (url: string) => {
    if (url === 'page-1') {
      return { data: { results: ['a', 'b'], next: 'page-2' } }
    }

    return { data: { results: ['c'], next: null } }
  },
}

const baseArguments = { url: 'page-1', authorizationHeaders: {} }

test('collects items across every page', async () => {
  const items = await getPaginatedMermaidData({
    ...baseArguments,
    axios: pagedAxios,
    errorCallback: () => {
      throw new Error('should not be called')
    },
  })

  expect(items).toEqual(['a', 'b', 'c'])
})

// Regression: this used to resolve with partial data and leak the rejection to the window as an
// unhandled rejection, which is how MERMAID-WEBAPP-M reached Sentry with no usable caller frames.
test('rejects when the error callback returns a rejected promise', async () => {
  const callbackError = new Error('callback rejected')

  await expect(
    getPaginatedMermaidData({
      ...baseArguments,
      axios: failingAxios,
      errorCallback: () => Promise.reject(callbackError),
    }),
  ).rejects.toThrow(callbackError)
})

test('rejects when the error callback throws', async () => {
  await expect(
    getPaginatedMermaidData({
      ...baseArguments,
      axios: failingAxios,
      errorCallback: (error: unknown) => {
        throw error
      },
    }),
  ).rejects.toThrow('Network Error')
})

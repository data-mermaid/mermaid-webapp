import { expect, test, vi } from 'vitest'
import { getPaginatedMermaidData } from './getPaginatedMermaidData'

const pagedAxios = {
  get: async (url: string) => {
    if (url === 'page-1') {
      return { data: { results: ['a', 'b'], next: 'page-2' } }
    }

    return { data: { results: ['c'], next: null } }
  },
}

// page-1 and page-2 succeed, page-3 fails, so the failure happens three levels into the recursion.
const failsOnThirdPageAxios = {
  get: async (url: string) => {
    if (url === 'page-1') {
      return { data: { results: ['a'], next: 'page-2' } }
    }

    if (url === 'page-2') {
      return { data: { results: ['b'], next: 'page-3' } }
    }

    throw new Error('Network Error')
  },
}

const failingAxios = {
  get: async () => {
    throw new Error('Network Error')
  },
}

const baseArguments = { url: 'page-1', authorizationHeaders: {} }

const rethrow = (error: unknown) => {
  throw error
}

test('collects items across every page', async () => {
  const items = await getPaginatedMermaidData({
    ...baseArguments,
    axios: pagedAxios,
    errorCallback: rethrow,
  })

  expect(items).toEqual(['a', 'b', 'c'])
})

test('treats a page with no results as empty', async () => {
  const items = await getPaginatedMermaidData({
    ...baseArguments,
    axios: { get: async () => ({ data: { next: null } }) },
    errorCallback: rethrow,
  })

  expect(items).toEqual([])
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

test('propagates the original error when the callback rethrows', async () => {
  await expect(
    getPaginatedMermaidData({ ...baseArguments, axios: failingAxios, errorCallback: rethrow }),
  ).rejects.toThrow('Network Error')
})

// Regression: awaiting the callback made a nested failure re-enter every ancestor's catch, so a
// failure on page N called the callback N times.
test('calls the error callback once when a page after the first fails', async () => {
  const errorCallback = vi.fn(rethrow)

  await expect(
    getPaginatedMermaidData({ ...baseArguments, axios: failsOnThirdPageAxios, errorCallback }),
  ).rejects.toThrow('Network Error')

  expect(errorCallback).toHaveBeenCalledTimes(1)
})

test('resolves with the pages loaded so far when the callback does not throw', async () => {
  const errorCallback = vi.fn()

  const items = await getPaginatedMermaidData({
    ...baseArguments,
    axios: failsOnThirdPageAxios,
    errorCallback,
  })

  expect(items).toEqual(['a', 'b'])
  expect(errorCallback).toHaveBeenCalledTimes(1)
})

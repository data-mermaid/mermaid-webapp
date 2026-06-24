import { expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'
import { ensureAttributesLoaded } from './ensureAttributesLoaded'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('ensureAttributesLoaded fetches only missing IDs and stores read-only copies', async () => {
  const put = vi.fn(async () => {})
  const bulkGet = vi.fn(async () => [{ id: 'existing-id' }, undefined])

  const dexieTable = {
    bulkGet,
    put,
  }

  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/invertattributes/missing-id/`, () => {
      return HttpResponse.json({
        id: 'missing-id',
        name: 'Fetched Name',
        uiState_pushToApi: true,
      })
    }),
  )

  await ensureAttributesLoaded({
    ids: ['existing-id', 'missing-id', 'existing-id', null, undefined],
    dexieTable,
    detailUrlById: (id) => `${apiBaseUrl}/invertattributes/${id}/`,
    getAccessToken: async () => 'fake-token',
    isOnlineAuthenticatedAndReady: true,
  })

  expect(bulkGet).toHaveBeenCalledTimes(1)
  expect(bulkGet).toHaveBeenCalledWith(['existing-id', 'missing-id'])
  expect(put).toHaveBeenCalledTimes(1)
  expect(put).toHaveBeenCalledWith({
    id: 'missing-id',
    name: 'Fetched Name',
    uiState_pushToApi: false,
  })
})

test('ensureAttributesLoaded does nothing when offline/not-ready', async () => {
  const put = vi.fn(async () => {})
  const bulkGet = vi.fn(async () => [])

  const dexieTable = {
    bulkGet,
    put,
  }

  await ensureAttributesLoaded({
    ids: ['id-1'],
    dexieTable,
    detailUrlById: (id) => `${apiBaseUrl}/invertattributes/${id}/`,
    getAccessToken: async () => 'fake-token',
    isOnlineAuthenticatedAndReady: false,
  })

  expect(bulkGet).not.toHaveBeenCalled()
  expect(put).not.toHaveBeenCalled()
})

test('ensureAttributesLoaded tolerates fetch failures', async () => {
  const put = vi.fn(async () => {})
  const bulkGet = vi.fn(async () => [undefined])

  const dexieTable = {
    bulkGet,
    put,
  }

  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/invertattributes/missing-id/`, () => {
      return new HttpResponse(null, { status: 404 })
    }),
  )

  await expect(
    ensureAttributesLoaded({
      ids: ['missing-id'],
      dexieTable,
      detailUrlById: (id) => `${apiBaseUrl}/invertattributes/${id}/`,
      getAccessToken: async () => 'fake-token',
      isOnlineAuthenticatedAndReady: true,
    }),
  ).resolves.toBeUndefined()

  expect(put).not.toHaveBeenCalled()
})

test('ensureAttributesLoaded rejects when dexieTable.put fails after a successful fetch', async () => {
  const put = vi.fn(async () => {
    throw new Error('dexie put failed')
  })
  const bulkGet = vi.fn(async () => [undefined])

  const dexieTable = {
    bulkGet,
    put,
  }

  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/invertattributes/missing-id/`, () => {
      return HttpResponse.json({
        id: 'missing-id',
        name: 'Fetched Name',
      })
    }),
  )

  await expect(
    ensureAttributesLoaded({
      ids: ['missing-id'],
      dexieTable,
      detailUrlById: (id) => `${apiBaseUrl}/invertattributes/${id}/`,
      getAccessToken: async () => 'fake-token',
      isOnlineAuthenticatedAndReady: true,
    }),
  ).rejects.toThrow('dexie put failed')

  expect(put).toHaveBeenCalledTimes(1)
})

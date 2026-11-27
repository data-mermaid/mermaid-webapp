import { expect, test, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import FishNameMixin from '../FishNamesMixin'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const createTable = (rowsById = {}) => ({
  bulkGet: vi.fn(async (ids) => ids.map((id) => rowsById[id])),
  put: vi.fn(async () => {}),
})

const createInstance = (dexieTables) => {
  const FishNames = FishNameMixin(class {})
  const instance = new FishNames()

  instance._isOnlineAuthenticatedAndReady = true
  instance._apiBaseUrl = apiBaseUrl
  instance._getAccessToken = async () => 'fake-token'
  instance._dexiePerUserDataInstance = dexieTables

  return instance
}

test('ensureFishSpeciesLoaded does not request genus, family or grouping ids from /fishspecies/', async () => {
  const requestedIds = []

  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/fishspecies/:id/`, ({ params }) => {
      requestedIds.push(params.id)

      return new HttpResponse(null, { status: 404 })
    }),
  )

  const fish_species = createTable()
  const instance = createInstance({
    fish_species,
    fish_genera: createTable({ 'genus-id': { id: 'genus-id' } }),
    fish_families: createTable({ 'family-id': { id: 'family-id' } }),
    fish_groupings: createTable({ 'grouping-id': { id: 'grouping-id' } }),
  })

  await instance.ensureFishSpeciesLoaded(['genus-id', 'family-id', 'grouping-id'])

  expect(requestedIds).toEqual([])
  expect(fish_species.put).not.toHaveBeenCalled()
})

test('ensureFishSpeciesLoaded still fetches missing species ids', async () => {
  const requestedIds = []

  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/fishspecies/:id/`, ({ params }) => {
      requestedIds.push(params.id)

      return HttpResponse.json({ id: params.id, display_name: 'Fetched species' })
    }),
  )

  const fish_species = createTable()
  const instance = createInstance({
    fish_species,
    fish_genera: createTable({ 'genus-id': { id: 'genus-id' } }),
    fish_families: createTable(),
    fish_groupings: createTable(),
  })

  await instance.ensureFishSpeciesLoaded(['genus-id', 'species-id'])

  expect(requestedIds).toEqual(['species-id'])
  expect(fish_species.put).toHaveBeenCalledTimes(1)
})

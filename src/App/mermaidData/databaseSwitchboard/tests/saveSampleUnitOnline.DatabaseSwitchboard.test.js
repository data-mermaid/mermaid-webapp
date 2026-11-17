import { expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

test('saveSampleUnit online stores a validated record as stale when the push fails', async () => {
  mockMermaidApiAllSuccessful.use(
    http.post(`${import.meta.env.VITE_MERMAID_API}/push/`, () => HttpResponse.error(), {
      once: true,
    }),
  )

  const dbInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const results = { data: { sample_event: { site: [{ code: 'site error', status: 'error' }] } } }

  await expect(
    dbInstance.saveSampleUnit({
      record: { id: 'foo', data: {}, validations: { status: 'ok', results } },
      profileId: '1',
      projectId: '5',
      protocol: 'fishbelt',
    }),
  ).rejects.toThrow()

  const recordStoredInDexie = await dbInstance.dexiePerUserDataInstance.collect_records.get('foo')

  expect(recordStoredInDexie.validations).toEqual({ status: 'stale', results })
})

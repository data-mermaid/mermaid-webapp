import { expect, test } from 'vitest'
import { getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

const saveOffline = (record) =>
  getDatabaseSwitchboardInstanceAuthenticatedOfflineDexieSuccess().saveSampleUnit({
    record,
    profileId: '1',
    projectId: '5',
    protocol: 'fishbelt',
  })

test('saveSampleUnit offline marks a validated record stale and keeps its results', async () => {
  const results = { data: { sample_event: { site: [{ code: 'site error', status: 'error' }] } } }

  const savedRecord = await saveOffline({
    id: 'foo',
    data: {},
    validations: { status: 'ok', results },
  })

  expect(savedRecord.validations).toEqual({ status: 'stale', results })
})

test('saveSampleUnit offline leaves a record with no validations without them', async () => {
  const savedRecord = await saveOffline({ id: 'foo', data: {} })

  expect(savedRecord.validations).toBeUndefined()
})

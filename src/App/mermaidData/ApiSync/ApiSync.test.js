import { rest } from 'msw'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../../testUtilities/mockMermaidData'
import ApiSync from './ApiSync'

test('pullApiDataMinimal hits the api with the correct config', async () => {
  const apiSync = new ApiSync({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance: getMockDexieInstanceAllSuccess(),
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
      const requestBody = req.body

      if (
        !requestBody.collect_records.profile ||
        !requestBody.collect_records.project
      ) {
        // this causes the test to fail if deleteFishBelt doesnt
        // send the api profile or project ids

        return res.once(ctx.status(400))
      }

      return res.once(ctx.status(200))
    }),
  )

  expect.assertions(1)

  await apiSync
    .pullApiDataMinimal({ profileId: '1', projectId: '1' })
    .then((response) => {
      expect(response.status).toEqual(200)
    })
})
test('pullApiDataMinimal keeps track of returned last_revision_nums and sends them with the next response', async () => {
  let hasFirstPullCallHappened = false

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
      const collectRecordLastRevisionNumber =
        req.body.collect_records.last_revision

      if (
        collectRecordLastRevisionNumber === null &&
        !hasFirstPullCallHappened
      ) {
        hasFirstPullCallHappened = true
        const response = {
          collect_records: { updates: [], deletes: [], last_revision_num: 17 },
        }

        return res(ctx.json(response))
      }

      if (
        collectRecordLastRevisionNumber === null &&
        hasFirstPullCallHappened
      ) {
        // pullApiDataMinimal shouldnt be sending nulls after
        // it has received a response from the server so we want
        // to cause the test to fail here
        return res(ctx.status(400))
      }

      return res(ctx.status(200))
    }),
  )

  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new ApiSync({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  // initial pull from api with last revision numbers being null
  await apiSync.pullApiDataMinimal({ profileId: '1', projectId: '1' })

  // second pull from api should have last revision numbers
  await apiSync.pullApiDataMinimal({ profileId: '1', projectId: '1' })
})

test('pullChangeWithChoices updates IDB with API data', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()
  const apiSync = new ApiSync({
    apiBaseUrl: process.env.REACT_APP_MERMAID_API,
    auth0Token: 'fake token',
    dexieInstance,
  })

  // add records to IDB that will be updated/deleted with mock api response
  await dexieInstance.transaction('rw', dexieInstance.collectRecords, () => {
    dexieInstance.collectRecords.put({
      ...mockMermaidData.collectRecords[1],
      somePropertyThatWillBeWipedOutByTheVersionOnTheApi: 'So long, farewell',
    })
    dexieInstance.collectRecords.put(mockMermaidData.collectRecords[0])
  })

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        collect_records: {
          updates: [mockMermaidData.collectRecords[1]],
          deletes: [mockMermaidData.collectRecords[0]],
          last_revision_num: 17,
        },
      }

      return res(ctx.json(response))
    }),
  )

  expect.assertions(2)
  await apiSync
    .pullApiDataMinimal({ profileId: '1', projectId: '1' })
    .then(async () => {
      const collectRecordsStored = await dexieInstance.collectRecords.toArray()

      expect(
        collectRecordsStored[0]
          .somePropertyThatWillBeWipedOutByTheVersionOnTheApi,
      ).not.toBeDefined()
      // expect second stored record to get deleted
      expect(collectRecordsStored.length).toEqual(1)
    })
})

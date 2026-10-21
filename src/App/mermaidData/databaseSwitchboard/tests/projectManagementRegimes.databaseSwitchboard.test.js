import { expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

test('getManagementRegimes only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexiePerUserDataInstance.project_managements.bulkPut([
    { id: 'foo', project: '5' },
    { id: 'bar', project: '5' },
    { id: 'baz', project: 'shouldGetFilteredOut' },
  ])
  const managementRegimes =
    await dbSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted('5')

  expect(managementRegimes.length).toEqual(2)
  expect(
    managementRegimes.find((profile) => profile.project === 'shouldGetFilteredOut'),
  ).toBeUndefined()
})

test('saveManagementRegime asks the API to skip its duplicate check', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const pushedManagementRegimes = []

  mockMermaidApiAllSuccessful.use(
    http.post(`${import.meta.env.VITE_MERMAID_API}/push/`, async ({ request }) => {
      const { project_managements = [] } = await request.json()
      pushedManagementRegimes.push(...project_managements)

      return HttpResponse.json({
        project_managements: project_managements.map((managementRegime) => ({
          status_code: 201,
          data: managementRegime,
        })),
      })
    }),
  )

  const { id } = await dbSwitchboardInstance.saveManagementRegime({
    managementRegime: { name: 'No-take zone' },
    projectId: '5',
  })

  expect(pushedManagementRegimes[0]).toMatchObject({ id, ignore_duplicate_warning: true })
})

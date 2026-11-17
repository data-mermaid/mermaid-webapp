import { expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import mockMermaidApiAllSuccessful from '../../../../testUtilities/mockMermaidApiAllSuccessful'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

test('getSites only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexiePerUserDataInstance.project_sites.bulkPut([
    { id: 'foo', project: '5' },
    { id: 'bar', project: '5' },
    { id: 'baz', project: 'shouldGetFilteredOut' },
  ])
  const sites = await dbSwitchboardInstance.getSitesWithoutOfflineDeleted('5')

  expect(sites.length).toEqual(2)
  expect(sites.find((profile) => profile.project === 'shouldGetFilteredOut')).toBeUndefined()
})

test('saveSite asks the API to skip its duplicate check', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const pushedSites = []

  mockMermaidApiAllSuccessful.use(
    http.post(`${import.meta.env.VITE_MERMAID_API}/push/`, async ({ request }) => {
      const { project_sites = [] } = await request.json()
      pushedSites.push(...project_sites)

      return HttpResponse.json({
        project_sites: project_sites.map((site) => ({ status_code: 201, data: site })),
      })
    }),
  )

  const { id } = await dbSwitchboardInstance.saveSite({ site: { name: 'Palau37' }, projectId: '5' })

  expect(pushedSites[0]).toMatchObject({ id, ignore_duplicate_warning: true })
})

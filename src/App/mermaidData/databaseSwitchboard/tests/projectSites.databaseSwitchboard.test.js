import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabseSwitchboard'

test('getSites only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexieInstance.project_sites.bulkPut([
    { id: 'foo', project: '5' },
    { id: 'bar', project: '5' },
    { id: 'baz', project: 'shouldGetFilteredOut' },
  ])
  const sites = await dbSwitchboardInstance.getSitesWithoutOfflineDeleted('5')

  expect(sites.length).toEqual(2)
  expect(
    sites.find((profile) => profile.project === 'shouldGetFilteredOut'),
  ).toBeUndefined()
})

test('getSite only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexieInstance.project_managements.bulkPut([
    { id: 'foo', project: 'shouldGetFilteredOut' },
  ])
  const site = await dbSwitchboardInstance.getSite({
    id: 'foo',
    projectId: '5',
  })

  expect(site).toBeUndefined()
})

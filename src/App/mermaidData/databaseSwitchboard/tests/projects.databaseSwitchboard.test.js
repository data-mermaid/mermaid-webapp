import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabseSwitchboard'

test('getProjectProfiles only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexieInstance.project_profiles.bulkPut([
    { id: 'foo', project: '5' },
    { id: 'bar', project: '5' },
    { id: 'baz', project: 'shouldGetFilteredOut' },
  ])
  const projectProfiles = await dbSwitchboardInstance.getProjectProfiles('5')

  expect(projectProfiles.length).toEqual(2)
  expect(
    projectProfiles.find(
      (profile) => profile.project === 'shouldGetFilteredOut',
    ),
  ).toBeUndefined()
})

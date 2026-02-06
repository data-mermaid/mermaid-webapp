import { expect, test } from "vitest";
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabseSwitchboard'

test('getManagementRegimes only returns profiles for a given project', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexiePerUserDataInstance.project_managements.bulkPut([
    { id: 'foo', project: '5' },
    { id: 'bar', project: '5' },
    { id: 'baz', project: 'shouldGetFilteredOut' },
  ])
  const managementRegimes = await dbSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(
    '5',
  )

  expect(managementRegimes.length).toEqual(2)
  expect(
    managementRegimes.find((profile) => profile.project === 'shouldGetFilteredOut'),
  ).toBeUndefined()
})

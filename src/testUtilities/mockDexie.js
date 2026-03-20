import Dexie from 'dexie'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'

const getMockDexieInstancesAllSuccess = () => {
  const dexiePerUserDataInstance = new Dexie('userDataDatabase', {
    indexedDB: new IDBFactory(),
    IDBKeyRange,
  })

  const dexieCurrentUserInstance = new Dexie('uiStateDatabase', {
    indexedDB: new IDBFactory(),
    IDBKeyRange,
  })

  dexiePerUserDataInstance.version(1).stores({
    benthic_attributes: 'id',
    choices: 'id',
    collect_records: 'id, project',
    fish_families: 'id',
    fish_groupings: 'id',
    fish_genera: 'id',
    fish_species: 'id',
    project_managements: 'id, project',
    project_profiles: 'id, project',
    project_sites: 'id, project',
    projects: 'id',
    uiState_lastRevisionNumbersPulled: '[dataType+projectId], projectId',
    uiState_offlineReadyProjects: 'id',
  })

  dexieCurrentUserInstance.version(1).stores({
    currentUser: 'id',
  })

  dexieCurrentUserInstance.currentUser
    .put({
      id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
      user: {
        id: 'fake-id',
        first_name: 'FakeFirstNameOffline',
        last_name: 'FakeLastNameOffline',
        full_name: 'FakeFirstNameOffline FakeLastNameOffline',
        projects: [{ id: 'fake-project-id', name: 'FakeProjectName', role: 90 }],
      },
    })
    .catch((error) =>
      console.error('Could not create fake current user in mock offline storage', error),
    )

  return { dexiePerUserDataInstance, dexieCurrentUserInstance }
}
const getMockDexieInstanceThatProducesErrors = () => {
  // produces an error in all cases so far because there are no stores defined
  // leaving indexedDb as undefined is extra assurance
  return new Dexie('mermaidError', {
    indexedDB: undefined,
  })
}

export { getMockDexieInstancesAllSuccess, getMockDexieInstanceThatProducesErrors }

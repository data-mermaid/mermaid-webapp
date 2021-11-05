import Dexie from 'dexie'
import FDBFactory from 'fake-indexeddb/lib/FDBFactory'
import IDBKeyRange from 'fake-indexeddb/lib/FDBKeyRange'

const getMockDexieInstanceAllSuccess = () => {
  const dexieInstance = new Dexie('mermaidAllSuccess', {
    indexedDB: new FDBFactory(),
    IDBKeyRange,
  })

  dexieInstance.version(1).stores({
    benthic_attributes: 'id',
    choices: 'id',
    collect_records: 'id, project',
    fish_families: 'id',
    fish_genera: 'id',
    fish_species: 'id',
    project_managements: 'id, project',
    project_profiles: 'id, project',
    project_sites: 'id, project',
    projects: 'id',
    uiState_currentUser: 'id',
    uiState_lastRevisionNumbersPulled: '[dataType+projectId], projectId',
    uiState_offlineReadyProjects: 'id',
  })

  dexieInstance.uiState_currentUser
    .put({
      id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
      user: {
        id: 'fake-id',
        first_name: 'FakeFirstNameOffline',
        last_name: 'FakeLastNameOffline',
        full_name: 'FakeFirstNameOffline FakeLastNameOffline',
      },
    })
    .catch((error) =>
      console.error('Could not create fake current user in mock offline storage', error),
    )

  return dexieInstance
}
const getMockDexieInstanceThatProducesErrors = () => {
  // produces an error in all cases so far because there are no stores defined
  // leaving indexedDb as undefined is extra assurance
  return new Dexie('mermaidError', {
    indexedDB: undefined,
  })
}

export { getMockDexieInstanceAllSuccess, getMockDexieInstanceThatProducesErrors }

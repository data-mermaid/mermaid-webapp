import Dexie from 'dexie'
import FDBFactory from 'fake-indexeddb/lib/FDBFactory'

const getMockDexieInstanceAllSuccess = () => {
  const dexieInstance = new Dexie('mermaidAllSuccess', {
    indexedDB: new FDBFactory(),
  })

  dexieInstance.version(1).stores({
    benthic_attributes: 'id',
    choices: 'id',
    collect_records: 'id',
    fish_families: 'id',
    fish_genera: 'id',
    fish_species: 'id',
    project_managements: 'id',
    project_profiles: 'id',
    project_sites: 'id',
    projects: 'id',
    uiState_currentUser: 'id',
    uiState_lastRevisionNumbersPulled: 'id',
    uiState_offlineReadyProjects: 'id',
  })

  dexieInstance.uiState_currentUser
    .put({
      id: 'fake-id',
      first_name: 'FakeFirstNameOffline',
      last_name: 'FakeLastNameOffline',
      full_name: 'FakeFirstNameOffline FakeLastNameOffline',
    })
    .catch((error) =>
      console.error(
        'Could not create fake current user in mock offline storage',
        error,
      ),
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

export {
  getMockDexieInstanceAllSuccess,
  getMockDexieInstanceThatProducesErrors,
}

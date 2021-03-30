import Dexie from 'dexie'
import fakeIndexedDB from 'fake-indexeddb'

const getMockDexieInstanceAllSuccess = () => {
  const dexieInstance = new Dexie('mermaidAllSuccess', {
    indexedDB: fakeIndexedDB,
  })

  dexieInstance.version(1).stores({
    currentUser: 'id',
    collectRecords: 'id',
  })

  dexieInstance.currentUser
    .put({
      id: 'fake-id',
      first_name: 'FakeFirstNameOffline',
    })
    .catch((error) =>
      console.error(
        'Could not create fake current user in mock offline storage',
        error,
      ),
    )

  return dexieInstance
}
const getMockDexieInstanceNoData = () => {
  const dexieInstance = new Dexie('mermaidNoData', {
    indexedDB: fakeIndexedDB,
  })

  dexieInstance.version(1).stores({
    currentUser: 'id',
  })

  return dexieInstance
}

export { getMockDexieInstanceAllSuccess, getMockDexieInstanceNoData }

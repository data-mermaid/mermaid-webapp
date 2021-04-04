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

import Dexie from 'dexie'
import fakeIndexedDB from 'fake-indexeddb'

const getMockDexieInstance = () => {
  const mockDexieInstance = new Dexie('mermaid', {
    indexedDB: fakeIndexedDB,
  })

  mockDexieInstance.version(1).stores({
    currentUser: 'id, first_name, last_name, full_name, email',
  })

  mockDexieInstance.currentUser
    .put({
      id: 'fake-id',
      first_name: 'FakeFirstNameOffline',
      last_name: 'FakeLastName',
      full_name: 'FakeFirstName FakeLastName',
      email: 'fake@email.com',
      created_on: '2020-10-16T15:27:30.555961Z',
      updated_on: '2020-10-16T15:27:30.569938Z',
    })
    .catch((error) =>
      console.error(
        'Could not create fake current user in mock offline storage',
        error,
      ),
    )

  return mockDexieInstance
}

export default getMockDexieInstance

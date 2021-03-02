import Dexie from 'dexie'
import fakeIndexedDB from 'fake-indexeddb'

const mockMermaidDbAccessInstance = new Dexie('mermaid', {
  indexedDB: fakeIndexedDB,
})

mockMermaidDbAccessInstance.version(1).stores({
  currentUser: 'id, first_name, last_name, full_name, email',
})

mockMermaidDbAccessInstance.currentUser
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

export default mockMermaidDbAccessInstance

import Dexie from 'dexie'

const dexieCurrentUserInstance = new Dexie('currentUser')

dexieCurrentUserInstance.version(1).stores({
  currentUser: 'id',
})

export { dexieCurrentUserInstance as default }

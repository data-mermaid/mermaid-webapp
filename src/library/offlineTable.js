import Dexie from 'dexie'

const DBName = 'mermaid-<PROFILE_ID>'
const DBVersion = 1
const schema = {
  collect_records: '++id',
  sites: '++id',
  management_regimes: '++id',
  project_profiles: '++id',
  projects: '++id',
}
const db = new Dexie(DBName, { autoOpen: true })

db.version(DBVersion).stores(schema)

export const _save = (tableName, data) => {
  return db.transaction('rw?', tableName, () => {
    return db[tableName].put(data)
  })
}

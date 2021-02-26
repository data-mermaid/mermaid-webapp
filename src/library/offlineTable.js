import Dexie from 'dexie'

const DB_Name = 'mermaid-<PROFILE_ID>'
const DB_Version = 1
const schema = {
  collect_records: '++id',
  sites: '++id',
  management_regimes: '++id',
  project_profiles: '++id',
  projects: '++id',
}
const db = new Dexie(DB_Name, { autoOpen: true })

db.version(DB_Version).stores(schema)

export const _save = (tableName, data) => {
  return db.transaction('rw?', tableName, () => {
    return db[tableName].put(data)
  })
}

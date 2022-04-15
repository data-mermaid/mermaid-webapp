import Dexie from 'dexie'

const dexiePerUserDataInstance = new Dexie('mermaid')

dexiePerUserDataInstance.version(1).stores({
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
  uiState_lastRevisionNumbersPulled: '[dataType+projectId], projectId',
  uiState_offlineReadyProjects: 'id',
})

export default dexiePerUserDataInstance

import Dexie from 'dexie'
import PropTypes from 'prop-types'

const dexieInstance = new Dexie('mermaid')

dexieInstance.version(1).stores({
  benthic_attributes: 'id',
  choices: 'id',
  collect_records: 'id',
  currentUser: 'id',
  fish_families: 'id',
  fish_genera: 'id',
  fish_species: 'id',
  lastRevisionNumbersPulled: 'id',
  project_managements: 'id',
  project_profiles: 'id',
  project_sites: 'id',
  projects: 'id',
  uiState_offlineReadyProjects: 'id',
})

// If This were TypeScript, types would be easy to obtain for Dexie
// however, we are using proptypes, so we'll make an exception for good typing
// here because this is a third party library
const dexieInstancePropTypes = PropTypes.any

export { dexieInstance as default, dexieInstancePropTypes }

import theme from '../../theme'
export const PAGE_SIZE_DEFAULT = 15
export const DEFAULT_RECORDS_PER_PAGE = 1000
export const API_NULL_NAME = '__null__'
export const PROJECT_CODES = {
  status: { open: 90, test: 80 },
  policy: { private: 10, publicSummary: 50 },
}
export const apiDataTypes = {
  benthicAttributes: 'benthic_attributes',
  choices: 'choices',
  collectRecords: 'collect_records',
  fishFamilies: 'fish_families',
  fishGroupings: 'fish_groupings',
  fishGenera: 'fish_genera',
  fishSpecies: 'fish_species',
  projectManagements: 'project_managements',
  projectProfiles: 'project_profiles',
  projectSites: 'project_sites',
}
export const IMAGE_CLASSIFICATION_COLORS = {
  confirmedPoint: theme.color.secondary,
  confirmed: theme.color.secondary,
  unconfirmedPoint: theme.color.secondary,
  unconfirmed: theme.color.secondary,
  unclassifiedPoint: '#808080',
  unclassified: '#BCBCBC',
  hover: '#ccc',
  selectedPoint: '#fff',
  selected: '#DDDCE4',
  outline: '#000',
}

Object.freeze(PROJECT_CODES)
Object.freeze(apiDataTypes)
Object.freeze(IMAGE_CLASSIFICATION_COLORS)

export const PENDING_USER_PROFILE_NAME = '(pending user)'

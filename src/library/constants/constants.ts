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
  // leaving these redundant for now until colors are finalized
  confirmedPoint: theme.color.brandSecondary,
  confirmed: theme.color.brandSecondary,
  unconfirmedPoint: theme.color.brandSecondary,
  unconfirmed: theme.color.brandSecondary,
  unclassifiedPoint: '#808080',
  unclassified: '#BCBCBC',
  hover: '#ccc',
  selectedPoint: '#fff',
  selected: '#DDDCE4',
  outline: '#000',
}

export const unclassifiedGuid = '00000000-0000-0000-0000-000000000000'

export const PENDING_USER_PROFILE_NAME = '(pending user)'

export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/mpo']
export const MAX_IMAGE_UPLOAD_SIZE = 30 * 1024 * 1024 // 30 MB
export const MAX_IMAGE_UPLOAD_SIZE_MB = 30 // 30 MB
export const MIN_IMAGE_WIDTH_HEIGHT = 1500
export const MAX_IMAGE_WIDTH_HEIGHT = 8000

Object.freeze(PROJECT_CODES)
Object.freeze(apiDataTypes)
Object.freeze(IMAGE_CLASSIFICATION_COLORS)

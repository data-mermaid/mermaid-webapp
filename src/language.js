const error = {
  appNotAuthenticatedOrReady:
    'Initialization error. Try reloading or reauthenticating',
  collectRecordUnavailable:
    'Collect record data is currently unavailable. Please try again',
  collectRecordChoicesUnavailable:
    'Options data for creating a collect record is currently unavailable. Please try again',
  collectRecordsUnavailable:
    'Collect records data is currently unavailable. Please try again',
  initialApiDataPull:
    'The app was not able to pull and store data from the API. Please try again.',
  projectsUnavailable:
    'Projects data is currently unavailable. Please try again',
  userProfileUnavailable: 'The user profile is unavailable.',
  collectRecordSave:
    'Something went wrong. The collect record has not been saved.',
  collectRecordDelete:
    'Something went wrong. The collect record has not been deleted.',
  generaUnavailable:
    'Fish genera data is currently unavailable. Please try again',
  fishSpeciesSave:
    'Something went Wrong. The new fish species has not been saved. Please try proposing it again.',
  fishSpeciesAlreadyExists:
    'The proposed fish species already exists in the list. The observation has been edited to show the existing species selected.',
  formValidation: { required: 'This field is required' },
}

const success = {
  collectRecordSave: 'Collect record saved.',
  collectRecordDelete: 'Collect record deleted.',
  newOrganizationAdd: 'Organization added.',
  fishSpeciesSave:
    'Proposed fish species saved. The observation has been edited to show it selected.',
}

const deleteCollectRecord = {
  title: 'Delete Record',
  prompt: 'Are you sure you want to delete this record?',
  yes: 'Delete Record',
  no: 'Cancel',
}

const createFishSpecies = {
  title: 'Add New Fish Species',
  genus: 'Genus',
  species: 'Species',
  goToPage2: 'Propose new species',
  cancel: 'Cancel',
  confirmMessage:
    'Your proposed new species will be reviewed by the MERMAID team, who will either approve it for inclusion in the taxonomy of contact you to follow up.',
  back: 'Back',
  getSummaryText1: ({ speciesName }) =>
    `I'd like to propose a new species called ${speciesName}.`,
  details: 'Details',
  user: 'User:',
  project: 'Project:',
  summaryText2:
    'Your proposed new species will be reviewed by the MERMAID team who will either approve it for inclusion in the taxonomy or contact you to follow up.',
  submit: 'Send to MERMAID for review',
}

const autocomplete = {
  noResultsDefault: 'No Results',
}

const pages = {
  collectRecord: {
    newFishSpeciesLink: 'Propose New Species...',
  },
  projectInfo: {
    newOrganizationNameLink: 'Suggest a new organization to MERMAID...',
    createOrganizationTitle: 'Suggest a new organization',
    suggestionOrganizationInputText: `If your organization is approved, it'll be automatically added to your project.`,
  },
  dataSharing: {
    introductionParagraph: `Given the urgent need for global coral reef conservation, MERMAID is committed to working collectively as a community and using the power of data to help make faster, better decisions. Coral reef monitoring data is collected with the intent of advancing coral reef science and improving management. We recognize the large effort to collect data and your sense of ownership. While not required, we hope you choose to make your data available to fuel new discoveries and inform conservation solutions.`,
    testProjectHelperText: 'Data for a test project will be omitted from all public reporting',
    moreInfoTitle: 'Data sharing'
  },
}

export default {
  error,
  success,
  deleteCollectRecord,
  autocomplete,
  pages,
  createFishSpecies,
}

const error = {
  appNotAuthenticatedOrReady:
    'Initialization error. Try reloading or reauthenticating',
  collectRecordUnavailable:
    'Collect record data is currently unavailable. Please try again',
  collectRecordChoicesUnavailable:
    'Options data for creating a collect record is currently unavailable. Please try again',
  collectRecordsUnavailable:
    'Collect records data is currently unavailable. Please try again',
  projectsUnavailable:
    'Projects data is currently unavailable. Please try again',
  userProfileUnavailable: 'The user profile is unavailable.',
  collectRecordSave:
    'Something went wrong. The collect record has not been saved.',
  collectRecordDelete:
    'Something went wrong. The collect record has not been deleted.',
}

const success = {
  collectRecordSave: 'Collect record saved.',
  collectRecordDelete: 'Collect record deleted.',
}

const prompt = {
  deleteCollectRecordTitle: 'Delete Record',
  deleteCollectRecordPrompt: 'Are you sure you want to delete this record?',
  yes: 'Delete Record',
  no: 'Cancel',
}

const autocomplete = {
  noResultsDefault: 'No Results',
}

const pages = {
  collectRecord: {
    newFishNameLink: 'Propose New Species...',
  },
  projectInfo: {
    newOrganizationNameLink: 'Suggest a new organization to MERMAID...',
  },
  dataSharing: {
    introductionParagraph: `Given the urgent need for global coral reef conservation, MERMAID is committed to working collectively as a community and using the power of data to help make faster, better decisions. Coral reef monitoring data is collected with the intent of advancing coral reef science and improving management. We recognize the large effort to collect data and your sense of ownership. While not required, we hope you choose to make your data available to fuel new discoveries and inform conservation solutions.`,
  },
}

export default { error, success, prompt, autocomplete, pages }

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
  newOrganizationAdd: 'Organization added.'
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
    suggestionOrganizationInputText: `If your organization is approved, it'll be automatically added to your project.`,
  },
}

export default { error, success, prompt, autocomplete, pages }

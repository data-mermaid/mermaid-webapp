// prettier-ignore
const error = {
  apiDataSync: 'the app was not able to sync data with the API. Please try again.',
  appNotAuthenticatedOrReady: 'Initialization error. Try reloading or reauthenticating',
  collectRecordChoicesUnavailable:
    'Options data for creating a collect record is currently unavailable. Please try again',
  collectRecordDelete: 'Something went wrong. The collect record has not been deleted.',
  collectRecordFailedValidation: 'Validation is currently unavailable for this record.',
  collectRecordIgnore: 'Something went wrong. This validation cannot be ignored. Please try again.',
  collectRecordReset: 'Something went wrong. This validation cannot be reset. Please try again.',
  collectRecordSave: 'Something went wrong. The collect record has not been saved.',
  collectRecordsUnavailable: 'Collect records data is currently unavailable. Please try again',
  collectRecordUnavailable: 'Collect record data is currently unavailable. Please try again',
  duplicateNewUserAdd: 'User has already been added to project.',
  emptyEmailAdd: 'No user email',
  error: 'Error',
  fishSpeciesAlreadyExists:
    'The proposed fish species already exists in the list. The observation has been edited to show the existing species selected.',
  fishSpeciesSave:
    'Something went Wrong. The new fish species has not been saved. Please try proposing it again.',
  formValidation: { required: 'This field is required' },
  generaUnavailable: 'Fish genera data is currently unavailable. Please try again',
  generic: 'Oooops. Something went wrong.',
  idNotFoundUserAction: 'Please check the URL in your browser address bar.',
  invalidEmailAdd: 'Invalid email',
  managementRegimeRecordsUnavailable:
    'Management Regime records data is currently unavailable. Please try again',
  managementRegimeRecordUnavailable:
    'Management Regime record data is currently unavailable. Please try again',
  projectsUnavailable: 'Projects data is currently unavailable. Please try again',
  siteRecordsUnavailable: 'Site records data is currently unavailable. Please try again',
  siteRecordUnavailable: 'Site record data is currently unavailable. Please try again',
  siteSave: 'Something went wrong. The site has not been saved.',
  submittedRecordsUnavailable: 'Submitted records data is currently unavailable. Please try again',
  submittedRecordUnavailable: 'Submitted record data is currently unavailable. Please try again',
  userProfileUnavailable: 'The user profile is unavailable.',
  userRecordsUnavailable: 'User records data is currently unavailable. Please try again',

  getIdsNotFoundDetails: (id) =>
    id.length > 1
      ? `The items with the ids ${id} can't be found.`
      : `The item with the id ${id} can't be found.`,
  getProjectTurnOnOfflineReadyFailure: (projectName) =>
    `Something went wrong. The Project ${projectName}, may not be ready to be used offline. Please try again.`,
  getProjectTurnOffOfflineReadyFailure: (projectName) =>
    `Something went wrong. The Project ${projectName}, has not been removed from being offline ready.`,
  pageUnavailableOffline: 'This page is unavailable offline.',
  pageNotFound: "This page can't be found.",
  pageNotFoundRecovery: 'Make sure the URL is correct.',
  idNotFound: "This item can't be found.",
  idNotFoundRecovery: 'It might have been deleted or the URL might be wrong.',
  homePageNavigation: 'Go back to the home page.',
}

const success = {
  collectRecordSave: 'Collect record saved.',
  collectRecordDelete: 'Collect record deleted.',
  newOrganizationAdd: 'Organization added.',
  fishSpeciesSave:
    'Proposed fish species saved. The observation has been edited to show it selected.',
  getProjectTurnOnOfflineReadySuccess: (projectName) =>
    `The project, ${projectName}, is now offline ready`,
  getProjectTurnOffOfflineReadySuccess: (projectName) =>
    `The project, ${projectName}, has been removed from being offline ready`,
  newUserAdd: 'New user added',
  newPendingUserAdd: 'Sign-up email sent. New user added as pending.',
  siteSave: 'Site saved.',
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
  goToPage2: 'Next',
  cancel: 'Cancel',
  confirmMessage:
    'Your proposed new species will be reviewed by the MERMAID team, who will either approve it for inclusion in the taxonomy of contact you to follow up.',
  back: 'Back',
  details: 'Details',
  user: 'User',
  project: 'Project',
  summaryText2:
    'Your proposed new species will be reviewed by the MERMAID team who will either approve it for inclusion in the taxonomy or contact you to follow up.',
  submit: 'Send to MERMAID for review',
}

const autocomplete = {
  noResultsDefault: 'No Results',
}

const pages = {
  projectsList: { offlineReadyCheckboxLabel: 'Offline Ready' },
  collectRecord: {
    newFishSpeciesLink: 'Propose New Species...',
    totalAbundanceLabel: 'Total Abundance',
    totalBiomassLabel: 'Total Biomass (kg/ha)',
  },
  projectInfo: {
    newOrganizationNameLink: 'Suggest a new organization to MERMAID...',
    createOrganizationTitle: 'Suggest a new organization',
    suggestionOrganizationHelperText: `If your organization is approved, it'll be automatically added to your project.`,
    organizationsHelperText: `Type to search for an organization.`,
    noOrganizationFound: `No organization found.`,
    removeOrganization: `Remove organization from project`,
  },
  dataSharing: {
    introductionParagraph: `Given the urgent need for global coral reef conservation, MERMAID is committed to working collectively as a community and using the power of data to help make faster, better decisions. Coral reef monitoring data is collected with the intent of advancing coral reef science and improving management. We recognize the large effort to collect data and your sense of ownership. While not required, we hope you choose to make your data available to fuel new discoveries and inform conservation solutions.`,
    testProjectHelperText: 'Data for a test project will be omitted from all public reporting.',
    moreInfoTitle: 'Data sharing',
  },
  submittedTable: {
    filterToolbarText: 'Filter sample units by method, site, management, or observer',
  },
  userTable: {
    filterToolbarText: 'Filter users by name, or email',
    searchEmailToolbarText: 'Enter email address of user to add',
    warningReadOnlyUser: `Some Sample Units can't be submitted because the user is in read-only mode.`,
    newUserModalTitle: `Invite new user`,
    newUserModalText: `will need to sign up because they're not already a MERMAID user. After they've signed up, they'll be added to this project`,
    transferSampleUnitsModalTitle: `Transfer Sample Units`,
    removeUserModalTitle: 'Remove User From Project',
    warningRemoveUser: `You must transfer sample units before you can remove the user from project.`,
  },
  submittedFishBeltForm: {
    toolbarLabel: 'Submitted sample units are read-only',
  },
  collectTable: {
    filterToolbarText: 'Filter sample units by method, site, management, or observer',
  },
  siteTable: {
    filterToolbarText: 'Filter sites by name, reef (type, zone, and exposure)',
  },
  managementRegimeTable: {
    filterToolbarText: 'Filter management regimes by name, or year',
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

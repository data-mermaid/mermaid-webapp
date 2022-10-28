// prettier-ignore
import { getSystemValidationErrorMessage, getDuplicateSampleUnitLink } from './library/validationMessageHelpers'

const projectCodes = {
  status: { open: 90, test: 80 },
  policy: { private: 10, publicSummary: 50 },
}

const inlineMessage = {
  ignore: 'ignored',
  warning: 'warning',
  error: 'error',
}

const error = {
  403: 'The current user does not have sufficient permission to do that.',
  500: 'Something went wrong with the server.',
  502: 'Something went wrong with the server.',
  503: 'Something went wrong with the server.',
  apiDataSync: 'The app was not able to sync data with the API. Please try again.',
  appNotAuthenticatedOrReady: 'Initialization error. Try reloading or reauthenticating.',
  collectRecordChoicesUnavailable:
    'Options data for creating a sample unit is currently unavailable. Please try again',
  collectRecordDelete: 'Something went wrong. The sample unit has not been deleted.',
  collectRecordValidation: 'Validation is currently unavailable for this record.',
  collectRecordValidationIgnore:
    'Something went wrong. This validation cannot be ignored. Please try again.',
  collectRecordValidationReset:
    'Something went wrong. This validation cannot be reset. Please try again.',
  collectRecordSave: 'Something went wrong. The sample unit has not been saved.',
  collectRecordSubmit: 'Something went wrong. The sample unit has not been submitted.',
  collectRecordsUnavailable: 'Sample unit data is currently unavailable. Please try again',
  collectRecordUnavailable: 'Sample unit data is currently unavailable. Please try again',
  duplicateNewUserAdd: 'User has already been added to project.',
  duplicateNewProject: 'A project with the same name already exists.',
  emptyEmailAdd: 'Please enter an email address.',
  error: 'Error',
  fishSpeciesAlreadyExists:
    'The proposed fish species already exists in the list. The observation has been edited to show the existing species selected.',
  fishSpeciesSave:
    'Something went Wrong. The new fish species has not been saved. Please try proposing it again.',
  attributeSave: (attribute) =>
    `Something went Wrong. The new ${attribute} has not been saved. Please try proposing it again.`,
  formValidation: {
    latitude: 'Latitude should be between -90° and 90°',
    longitude: 'Longitude should be between -180° and 180°',
    required: 'This field is required',
  },
  generaUnavailable: 'Fish genera data is currently unavailable. Please try again.',
  generic: 'Something went wrong.',
  idNotFoundUserAction: "Please check the URL in your browser's address bar.",
  invalidEmailAdd: 'Invalid email address.',
  managementRegimeRecordsUnavailable:
    'Management Regime records data is currently unavailable. Please try again.',
  managementRegimeRecordUnavailable:
    'Management Regime record data is currently unavailable. Please try again.',
  managementRegimeSave: 'Something went wrong. The management regime has not been saved.',
  notificationsUnavailable: 'Notifications are unavailable.',
  notificationNotDeleted: 'Notification could not be removed.',
  projectSave: 'Something went wrong. The project has not been saved.',
  projectsUnavailable: 'Projects data is currently unavailable. Please try again.',
  siteRecordsUnavailable: 'Site records data is currently unavailable. Please try again.',
  siteRecordUnavailable: 'Site record data is currently unavailable. Please try again.',
  siteSave: 'Something went wrong. The site has not been saved.',
  submittedRecordsUnavailable: 'Submitted records data is currently unavailable. Please try again',
  submittedRecordUnavailable: 'Submitted record data is currently unavailable. Please try again',
  submittedRecordMoveToCollect:
    'Something went wrong. The submitted record has not been made editable',
  userProfileUnavailable: 'The user profile is unavailable.',
  userRecordsUnavailable: 'User records data is currently unavailable. Please try again.',
  projectHealthRecordsUnavailable:
    'Summary records data is currently unavailable. Please try again',
  attributeAlreadyExists: (attribute) =>
    `The proposed ${attribute} already exists in the list. The observation has been edited to show the existing ${attribute} selected.`,

  getIdsNotFoundDetails: (id) =>
    id.length > 1
      ? `The items with the ids ${id} can't be found.`
      : `The item with the id ${id} can't be found.`,
  getProjectTurnOnOfflineReadyFailure: (projectName) =>
    `Something went wrong. The Project ${projectName}, may not be ready to be used offline. Please try again.`,
  getProjectTurnOffOfflineReadyFailure: (projectName) =>
    `Something went wrong. The Project ${projectName}, has not been removed from being offline-ready.`,
  getUserRoleChangeFailureMessage: (userName) =>
    `Something went wrong. ${userName}'s role has not been changed.`,
  pageUnavailableOffline: 'This page is unavailable offline.',
  pageNotFound: "This page can't be found.",
  pageNotFoundRecovery: 'Make sure the URL is correct.',
  pageReadOnly: 'You cannot access this page because you are a read-only member of this project.',
  idNotFound: "This item can't be found.",
  idNotFoundRecovery:
    "It might have been deleted, you don't have permission to view it, or the URL might be wrong.",
  homePageNavigation: 'Go back to the home page.',
  transferSampleUnitsUnavailable:
    'Something went wrong. Sample units are failed to transfer. Please try again.',
}

const success = {
  collectRecordSave: 'Record saved.',
  collectRecordSubmit: 'Record submitted.',
  collectRecordDelete: 'Record deleted.',
  newOrganizationAdd: 'Organization added.',
  fishSpeciesSave:
    'Proposed fish species saved. The observation has been edited to show it selected.',
  getProjectTurnOnOfflineReadySuccess: (projectName) =>
    `The project, ${projectName}, is now offline ready`,
  getProjectTurnOffOfflineReadySuccess: (projectName) =>
    `The project, ${projectName}, has been removed from being offline ready`,
  getUserRoleChangeSuccessMessage: ({ userName, role }) =>
    `${userName}'s role is now set to ${role}.`,
  newUserAdd: 'New user added.',
  newPendingUserAdd: 'Sign-up email sent. New user added as Pending User.',
  userRemoved: 'User removed',
  projectSave: 'Project saved',
  projectCopied: 'Project copied',
  projectCreated: 'Project created',
  siteSave: 'Site saved.',
  managementRegimeSave: 'Management Regime saved.',
  submittedRecordMoveToCollect: 'The submitted record has been moved to collecting.',
  projectStatusSaved: `Test project selection saved.`,
  getDataSharingPolicyChangeSuccess: (method, policy_code) => {
    switch (policy_code) {
      case projectCodes.policy.private:
        return `${method} is now set to private`
      case projectCodes.policy.publicSummary:
        return `${method} is now set to public summary`
      default:
        // policy code for public is 100
        return `${method} is now set to public `
    }
  },
  userProfileUpdate: 'Profile updated',
  attributeSave: (attribute) =>
    `Proposed benthic ${attribute} saved. The observation has been edited to show it selected.`,
}

const deleteCollectRecord = {
  title: 'Delete Record',
  prompt: 'Are you sure you want to delete this record?',
  yes: 'Delete Record',
  no: 'Cancel',
}

const loadingIndicator = {
  loadingPrimary: 'Loading',
  loadingSecondary: 'Still working...',
}

const createNewOptionModal = {
  addNewAttributeTitle: (attribute) => `Add New ${attribute}`,
  genus: 'Genus',
  species: 'Species',
  newBenthicAttribute: 'Benthic Attribute',
  benthicAttributeParent: 'Parent',
  newBenthicAttributeName: 'Name',
  goToNextPage: 'Next',
  cancel: 'Cancel',
  back: 'Back',
  details: 'Details',
  user: 'User',
  project: 'Project',
  proposedSummaryText: (attribute) =>
    `Your proposed new ${attribute} will be reviewed by the MERMAID team. They will either approve it for inclusion in the taxonomy or contact you to follow up.`,
  submit: 'Send to MERMAID for review',
}

const autocomplete = {
  noResultsDefault: 'No results found',
}

const header = {
  noNotifications: 'There are currently no notifications',
}

const table = {
  sortAscendingTitle: 'Sort ascending',
  sortDescendingTitle: 'Sort descending',
  sortRemoveTitle: 'Remove sort',
  noFilterResults: 'No results',
  noFilterResultsSubText: 'No records match the current filter term.',
}

const title = {
  mermaid: 'MERMAID',
  mermaidDescription: 'Marine Ecological Research Management Aid',
  userProfileModal: 'Your Profile',
}

const pages = {
  projectsList: {
    title: 'Projects',
    offlineReadyCheckboxLabel: 'Offline Ready',
    noDataTextOnline: `You aren't part of any projects yet.`,
    noDataSubText: `Create a new project or get your admin to add you to some.`,
    noDataTextOffline: `You don't have any offline projects.`,
    noFilterResults: 'No results',
    noFilterResultsSubText: 'No projects match the current filter term.',
    readOnlyUserWithActiveSampleUnits:
      'You cannot submit these collect records because you only have read-only access to this project. Please contact a project admin.',
  },
  collectRecord: {
    title: 'Collecting',
    newFishSpeciesLink: 'Propose New Species...',
    totalAbundanceLabel: 'Total Abundance',
    totalBiomassLabel: 'Total Biomass (kg/ha)',
    newBenthicAttributeLink: 'Propose New Benthic Attribute...',
  },
  projectInfo: {
    title: 'Project Info',
    newOrganizationNameLink: 'Suggest a new organization to MERMAID...',
    createOrganizationTitle: 'Suggest a new organization',
    suggestionOrganizationHelperText: `If your organization is approved, it'll be automatically added to your project.`,
    organizationsHelperText: `Type to search for an organization.`,
    noOrganizationFound: `No organization found.`,
    removeOrganization: `Remove organization from project`,
  },
  dataSharing: {
    title: 'Data Sharing',
    introductionParagraph: `Given the urgent need for global coral reef conservation, MERMAID is committed to working collectively as a community and using the power of data to help make faster, better decisions. Coral reef monitoring data is collected with the intent of advancing coral reef science and improving management. We recognize the large effort to collect data and your sense of ownership. While not required, we hope you choose to make your data available to fuel new discoveries and inform conservation solutions.`,
    testProjectHelperText: 'Data for a test project will not be included in public reporting.',
    moreInfoTitle: 'Data sharing',
  },
  submittedTable: {
    title: 'Submitted',
    filterToolbarText: 'Filter sample units by method, site, management, or observer',
    noDataText: `This project has no submitted sample units.`,
  },
  userTable: {
    title: 'Users',
    filterToolbarTextForAdmin: 'Filter users by name or email',
    filterToolbarTextForNonAdmin: 'Filter users by name or role',
    searchEmailToolbarText: 'Enter email address of user to add',
    warningReadOnlyUser: `Some Sample Units can't be submitted because the user is in read-only mode.`,
    newUserModalTitle: `Invite new user`,
    newUserModalText: `will need to sign up because they're not already a MERMAID user.`,
    transferSampleUnitsModalTitle: `Transfer Sample Units`,
    warningTransferSampleUnits: `You must transfer unsubmitted sample units before you can remove the user from project.`,
    deleteUnsyncedModalTitle: 'Delete Unsynced Sample Units',
    deleteUnsyncedButton: 'Delete Unsynced Sample Units',
    removeUserModalTitle: 'Remove User From Project',
    removeUserButton: 'Remove User',
    cancelButton: 'cancel'
  },
  fishBeltForm: {
    title: 'Fish Belt',
  },
  submittedFishBeltForm: {
    title: 'Fish Belt',
    sampleUnitsAreReadOnly: 'Submitted sample units are read-only.',
    moveSampleUnitButon: 'Edit Sample Unit - move to Collecting',
    adminEditOnly:
      'Submitted sample units are read-only and can only be moved to Collecting by an admin.',
  },
  collectTable: {
    title: 'Collecting',
    filterToolbarText: 'Filter sample units by method, site, management, or observer',
    noDataText: `You don't have any active sample units`,
  },
  siteForm: {
    title: 'Site',
  },
  siteTable: {
    title: 'Sites',
    filterToolbarText: 'Filter sites by name, reef (type, zone, and exposure)',
    noDataText: `This project has no sites.`,
    noDataExtraText: `You can add sites by creating a new one or copying them from another project.`,
    controlZoomText: 'Use Ctrl + Scroll to zoom the map',
  },
  managementRegimeForm: {
    title: 'Management Regime',
  },
  managementRegimeTable: {
    title: 'Management Regimes',
    filterToolbarText: 'Filter management regimes by name or year',
    noDataText: `This project has no management regimes.`,
    noDataExtraText: `You can add management regimes by creating a new one or copying them from another project.`,
  },
  usersAndTransectsTable: {
    title: 'Users and Transects',
    filterToolbarText: 'Filter sample units by site or method',
    missingSiteName: '(Missing Site Name)',
    missingLabelNumber: 'missing number',
  },
  managementRegimesOverview: { title: 'Management Regimes Overview' },
  benthicPhotoQuadratForm: {
    title: 'Benthic Photo Quadrat',
  },
  copySiteTable: {
    title: 'Copy Sites',
    filterToolbarText: 'Filter sites by name, project or country',
    copyButtonText: 'Copy selected sites to project',
  },
  copyManagementRegimeTable: {
    title: 'Copy Management Regimes',
    filterToolbarText: 'Filter management regimes by name or year',
    copyButtonText: 'Copy selected MRs to project',
  },
}

const navigateAwayPrompt =
  'Are you sure you want to leave this page? You have some unsaved changes.'

const projectModal = {
  copyMessage:
    'Sites, Management Regimes, Data Sharing, and Users and their roles will be copied to the new project.',
  copyTitle: 'Copy Project',
  createTitle: 'Create Project',
  footerMessage: 'You will be an admin for this project.',
}

const map = {
  attribution:
    'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community &copy; <a href="http://www.allencoralatlas.org/"  style="font-size:1.25rem;">2019 Allen Coral Atlas Partnership and Vulcan, Inc.</a>',
}

const getValidationMessage = (validation, projectId = '') => {
  const { code, context, name } = validation

  const validationMessages = {
    all_equal: () => 'All observations are the same',
    diff_num_quadrats: () => 'Defined number of quadrats does not match',
    duplicate_fishbelt_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_collection: () =>
      `Duplicate sample unit ${context?.duplicate_transect_method}`,
    duplicate_quadrat_transect: () => `Duplicate sample unit ${context?.duplicate_transect_method}`,
    duplicate_transect: () => 'Transect already exists',
    duplicate_values: () => 'Duplicate',
    exceed_total_colonies: () => 'Maximum number of colonies exceeded',
    future_sample_date: () => 'Sample date is in the future',
    invalid_depth: () => 'Invalid depth',
    invalid_fish_count: () => 'Invalid fish count',
    invalid_fishbelt_transect: () => 'Invalid sample unit',
    invalid_number_of_points: () => 'Invalid number of points per quadrat',
    invalid_percent_value: () => 'Not a valid percent value',
    invalid_quadrat_collection: () => 'Invalid sample unit',
    invalid_quadrat_numbers: () =>
      `Number of points entered for quadrat numbers ${context?.invalid_quadrat_numbers}, does not match defined number of points per quadrat`,
    invalid_quadrat_size: () => 'Invalid quadrat size',
    invalid_quadrat_transect: () => 'Invalid quadrat transect',
    invalid_sample_date: () => 'Invalid date',
    len_surveyed_out_of_range: () =>
      `Transect length surveyed value outside range of ${context?.len_surveyed_range[0]} and ${context?.len_surveyed_range[1]}`,
    low_density: () => `Fish biomass less than ${context?.biomass_range[1]} kg/ha`,
    management_not_found: () => 'Management Regime record not available for similarity validation',
    max_depth: () =>
      `Depth value outside range of ${context?.depth_range[0]} and ${context?.depth_range[1]}`,
    max_fish_size: () => 'Fish size is larger than species max size',
    minimum_total_fish_count: () => `Total fish count less than ${context?.minimum_fish_count}`,
    missing_quadrat_numbers: () => `Missing quadrat numbers ${context?.missing_quadrat_numbers}`,
    no_region_match: () => 'Attributes outside of site region',
    not_part_of_fish_family_subset: () =>
      'There are fish that are not part of project defined fish families',
    not_positive_integer: () => 'Value is not greater or equal to zero',
    not_unique_site: () => 'Site: Similar records detected',
    not_unique_management: () =>
      'Management Regime: Other sample events at this site have a different management regime',
    high_density: () => `Fish biomass greater than ${context?.biomass_range[0]} kg/ha`,
    required_management_rules: () => 'Management rules are required',
    sample_time_out_of_range: () =>
      `Sample time outside of range ${context?.time_range[0]} and ${context?.time_range[1]}`,
    similar_name: () => 'Management Regime: Similar records detected',
    site_not_found: () => 'Site record not available for similarity validation',
    too_many_observations: () => `Greater than ${context?.observation_count_range[1]} observations`,
    too_few_observations: () => `Fewer than ${context?.observation_count_range[0]} observations`,
    unsuccessful_dry_submit: () => getSystemValidationErrorMessage(context?.dry_submit_results),
    value_not_set: () => 'Value is not set',
    default: () => code || name,
  }

  return (validationMessages[code] || validationMessages.default)()
}

const getErrorTitle = (page) => `The ${page} has not been saved. `

const getErrorMessages = (pageError) => {
  return Object.entries(pageError)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

export default {
  projectCodes,
  error,
  success,
  deleteCollectRecord,
  loadingIndicator,
  autocomplete,
  header,
  table,
  title,
  pages,
  createNewOptionModal,
  navigateAwayPrompt,
  getValidationMessage,
  inlineMessage,
  projectModal,
  map,
  getErrorTitle,
  getErrorMessages,
}

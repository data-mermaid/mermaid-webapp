// prettier-ignore
import React from 'react'

import { PROJECT_CODES } from './library/constants/constants'
import {
  getSystemValidationErrorMessage,
  getDuplicateSampleUnitLink,
  goToManagementOverviewPageLink,
} from './library/validationMessageHelpers'
import { HelperTextLink } from './components/generic/links'

const inlineMessage = {
  ignore: 'ignored',
  warning: 'warning',
  error: 'error',
}

const apiDataTableNames = {
  benthic_attributes: 'benthic attributes',
  collect_records: 'unsubmitted sample units',
  fish_species: 'fish species',
  project_managements: 'management regimes',
  project_profiles: 'project users',
  project_sites: 'sites',
  projects: 'project info',
}

const error = {
  403: 'The current user does not have permission to do that.',
  500: 'MERMAID error: please contact support@datamermaid.org',
  502: 'MERMAID error: please contact support@datamermaid.org',
  503: 'MERMAID error: please contact support@datamermaid.org',
  apiDataSync: 'MERMAID was not able to sync data.',
  appNotAuthenticatedOrReady:
    'MERMAID did not load correctly. Try logging out and then logging back in.',
  collectRecordSupportingDataUnavailable:
    'Supporting data for creating a sample unit is currently unavailable.',
  collectRecordDelete: 'The sample unit has not been deleted.',
  collectRecordValidation: 'Validation is currently unavailable for this record.',
  collectRecordValidationIgnore: 'This validation cannot be ignored.',
  collectRecordValidationReset: 'This validation cannot be reset.',
  collectRecordSave: 'The sample unit has not been saved.',
  collectRecordSubmit: 'The sample unit has not been submitted.',
  collectRecordsUnavailable: 'Sample unit data are currently unavailable.',
  collectRecordUnavailable: 'Sample unit data are currently unavailable.',
  collectRecordSubmitDisabled: 'Errors or warnings are preventing you from submitting',
  duplicateNewUserAdd: 'User has already been added to project.',
  emptyEmailAdd: 'Please enter an email address.',
  fishSpeciesAlreadyExists:
    'The proposed fish species already exists in the list. The observation has been edited to show the existing species selected.',
  fishSpeciesSave: 'The new fish species has not been saved.',
  attributeSave: (attribute) => `The new ${attribute} has not been saved.`,
  formValidation: {
    latitude: 'Latitude should be between -90° and 90°',
    longitude: 'Longitude should be between -180° and 180°',
    required: 'This field is required',
    projectNameExists: 'Project name already exists',
    managementPartialRestrictionRequired: 'At least one rule is required',
  },
  generic: 'MERMAID error.',
  getSaveOnlineSyncErrorTitle: (mermaidDataTypeLabel) =>
    `The ${mermaidDataTypeLabel} has been saved on your computer, but not online.`,
  getDeleteOnlineSyncErrorTitle: (mermaidDataTypeLabel) =>
    `The ${mermaidDataTypeLabel} has not been deleted from your computer or online.`,
  getSaveOfflineErrorTitle: (mermaidDataTypeLabel) =>
    `The ${mermaidDataTypeLabel} failed to save both on your computer and online.`,
  getDeleteOfflineErrorTitle: (mermaidDataTypeLabel) =>
    `The ${mermaidDataTypeLabel} has failed to delete from your computer or online.`,
  idNotFoundUserAction: "Please check the URL in your browser's address bar.",
  invalidEmailAdd: 'Invalid email address.',
  managementRegimeRecordsUnavailable: 'Management Regime records data are currently unavailable.',
  managementRegimeRecordUnavailable: 'Management Regime record data are currently unavailable.',
  notificationsUnavailable: 'Notifications are unavailable.',
  notificationNotDeleted: 'Notification could not be removed.',
  notificationsNotDeleted: 'Notifications could not be removed',
  projectSave: 'The project has not been saved.',
  projectsUnavailable: 'Project data are currently unavailable.',
  projectWithSameName: 'A project with the same name already exists.',
  siteRecordsUnavailable: 'Site record data are currently unavailable.',
  siteRecordUnavailable: 'Site record data are currently unavailable.',
  submittedRecordsUnavailable: 'Submitted record data are currently unavailable.',
  submittedRecordUnavailable: 'Submitted record data are currently unavailable.',
  submittedRecordMoveToCollect: 'The submitted record has not been made editable',
  userProfileUnavailable: 'The user profile is unavailable.',
  userRecordsUnavailable: 'User record data are currently unavailable.',
  projectHealthRecordsUnavailable: 'Summary record data are currently unavailable.',
  attributeAlreadyExists: (attribute) =>
    `The proposed ${attribute} already exists in the list. The observation has been edited to show the existing ${attribute} selected.`,

  getIdsNotFoundDetails: (id) =>
    id.length > 1
      ? `The items with the ids ${id} cannot be found.`
      : `The item with the id ${id} cannot be found.`,
  getProjectTurnOnOfflineReadyFailure: (projectName) =>
    `The Project ${projectName}, may not be ready to be used offline.`,
  getProjectTurnOffOfflineReadyFailure: (projectName) =>
    `The Project ${projectName}, has not been removed from being offline-ready.`,
  getPushSyncErrorMessage: (projectName) => (
    <>
      You do not have permission to sync data to <strong>{projectName}</strong>. Please check your
      notifications and consult with a project administrator about your project role.
    </>
  ),
  pushSyncErrorMessageUnsavedData: 'The following have not been saved: ',
  pushSyncErrorMessageStatusCode500: 'MERMAID sync error: please contact support@datamermaid.org',
  getUserRoleChangeFailureMessage: (userName) => `${userName}'s role has not been changed.`,
  pageUnavailableOffline: 'This page is unavailable offline.',
  pageNotFound: 'This page cannot be found.',
  pageNotFoundRecovery: 'Make sure the URL is correct.',
  pageReadOnly: 'You cannot access this page because you are a read-only member of this project.',
  idNotFound: 'This item cannot be found.',
  idNotFoundRecovery:
    'It might have been deleted, you do not have permission to view it, or the URL might be wrong.',
  homePageNavigation: 'Go back to the home page.',
  transferSampleUnitsUnavailable: 'Sample units failed to transfer.',
  onPageWarningAbove: 'Warning or error',
  onPageWarningBelow: 'Warning or error',
  errorBoundaryPrimary: 'A part of this page did not load correctly.',
  errorBoundarySecondary: 'If you keep seeing this error, try reloading this page, or you can',
  errorBoundaryContactUs: 'contact us',
  errorBoundaryTryAgain: 'Try Again',
  disabledFishSizeBinSelect: "You can't change the fish size bin when there are observations",
  addRowUnavailable: 'You must select a fish size bin before adding any observations.',
  noServerResponse:
    'Unable to communicate with server. Changes saved on your computer, but not online.',
}

const success = {
  collectRecordSave: 'Record saved.',
  collectRecordSubmit: 'Record submitted.',
  collectRecordDelete: 'Record deleted.',
  newOrganizationAdd: 'Organization added.',
  fishSpeciesSave:
    'Proposed fish species saved. The observation has been edited to show it selected.',
  getProjectTurnOnOfflineReadySuccess: (projectName) => `${projectName} is now offline ready`,
  getProjectTurnOffOfflineReadySuccess: (projectName) =>
    `${projectName} has been removed from being offline ready`,
  getUserRoleChangeSuccessMessage: ({ userName, role }) =>
    `${userName}'s role is now set to ${role}.`,
  newUserAdd: 'New user added.',
  newPendingUserAdd: 'Sign-up email sent. New user added as Pending User.',
  userRemoved: 'User removed',
  projectSave: 'Project saved',
  projectCopied: 'Project copied',
  projectCreated: 'Project created',
  getMermaidDataSaveSuccess: ({ mermaidDataTypeLabel, isAppOnline }) =>
    isAppOnline
      ? `The ${mermaidDataTypeLabel} has been saved on your computer and online.`
      : `The ${mermaidDataTypeLabel} has been saved on your computer.`,
  getMermaidDataDeleteSuccess: (mermaidDataTypeLabel) =>
    `The ${mermaidDataTypeLabel} has been deleted from your computer and online.`,

  submittedRecordMoveToCollect: 'The submitted record has been moved to collecting.',
  projectStatusSaved: `Test project selection saved.`,
  getDataSharingPolicyChangeSuccess: (method, policy_code) => {
    switch (policy_code) {
      case PROJECT_CODES.policy.private:
        return `${method} is now set to private`
      case PROJECT_CODES.policy.publicSummary:
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

const deleteRecord = (pageName) => {
  return {
    title: `Delete ${pageName}`,
    prompt: `Are you sure you want to delete this ${pageName.toLowerCase()}?`,
    yes: `Delete ${pageName}`,
    no: 'Cancel',
    confirmDeleteText1: `You cannot delete this ${pageName.toLowerCase()} because it is used in the following sample units:`,
    confirmDeleteText2: `You have to remove this ${pageName.toLowerCase()} from all sample units before you can delete it.`,
  }
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

const clearSizeValuesModal = {
  title: `Clear Size Values`,
  prompt: `This will clear all the size values for all observations.`,
  yes: `Clear Size Values`,
  no: 'Cancel',
}

const autocomplete = {
  noResultsDefault: 'No results found',
}

const header = {
  noNotifications: 'There are currently no notifications',
  dismissAllNotifications: 'Dismiss all notifications',
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

// property names are protocol types and derived from api data values
const protocolTitles = {
  fishbelt: 'Fish Belt',
  benthiclit: 'Benthic LIT',
  benthicpit: 'Benthic PIT',
  habitatcomplexity: 'Habitat Complexity',
  bleachingqc: 'Bleaching',
  benthicpqt: 'Benthic Photo Quadrat',
}

const pages = {
  userDoesntHaveProjectAccess: {
    title: 'You do not have permission to access this project.',
    getSubtitle: (projectName) => {
      const projectNameToUse = projectName || <code>unknown project name</code>

      return <>The admin of {projectNameToUse} can add you to this project.</>
    },
    homepageLink: 'Go back to the home page.',
  },
  projectsList: {
    title: 'Projects',
    offlineReadyCheckboxLabel: 'Offline Ready',
    noDataMainTextOnline: `You are not part of any projects yet.`,
    noDataSubText: `Create a new project or get your admin to add you to some.`,
    noDataMainTextOffline: `You do not have any offline projects.`,
    noFilterResults: 'No results',
    noFilterResultsSubText: 'No projects match the current filter term.',
    readOnlyUserWithActiveSampleUnits:
      'You cannot submit these collect records because you only have read-only access to this project. Please contact the project admin.',
  },
  collectRecord: {
    title: 'Collecting',
    newFishSpeciesLink: 'Propose New Species...',
    totalAbundanceLabel: 'Total Abundance',
    totalBiomassLabel: 'Total Biomass (kg/ha)',
    newBenthicAttributeLink: 'Propose New Benthic Attribute...',
  },
  projectInfo: {
    createOrganizationTitle: 'Suggest a new organization',
    newOrganizationNameLink: 'Suggest a new organization to MERMAID...',
    noNotes: 'No notes for this Project',
    noOrganizationFound: `No organization found.`,
    organizationsHelperText: `Type to search for an organization.`,
    removeOrganization: `Remove organization from Project`,
    suggestionOrganizationHelperText: `If your organization is approved, it'll be automatically added to your Project.`,
    title: 'Project Info',
    organizations: 'Organizations',
    notes: 'Notes',
    noOrganization: 'This Project has no organizations.',
  },
  dataSharing: {
    introductionParagraph: `Given the urgent need for global coral reef conservation, MERMAID is committed to working collectively as a community and using the power of data to help make faster, better decisions. Coral reef monitoring data are collected with the intent of advancing coral reef science and improving management. We recognize the large effort to collect data and your sense of ownership. While not required, we hope you choose to make your data available to fuel new discoveries and inform conservation solutions.`,
    isTestProject: 'This is a test project',
    moreInfoTitle: 'Data sharing',
    testProjectHelperText: 'Data for a test project will not be included in public reporting.',
    title: 'Data Sharing',
  },
  submittedTable: {
    title: 'Submitted',
    filterToolbarText: 'Filter this table by method, site, management, or observer',
    noDataMainText: `This project has no submitted sample units.`,
  },
  userTable: {
    title: 'Users',
    filterToolbarTextForAdmin: 'Filter this table by name or email',
    filterToolbarTextForNonAdmin: 'Filter this table by name or role',
    searchEmailToolbarText: 'Enter email address of user to add',
    warningReadOnlyUser: `Some Sample Units cannot be submitted because the user is in read-only mode.`,
    newUserModalTitle: `Invite new user`,
    newUserModalText: `will need to sign up because they're not already a MERMAID user.`,
    transferSampleUnitsModalTitle: `Transfer Sample Units`,
    warningTransferSampleUnits: `You must transfer unsubmitted sample units before you can remove the user from project.`,
    deleteUnsyncedModalTitle: 'Delete Unsynced Sample Units',
    deleteUnsyncedButton: 'Delete Unsynced Sample Units',
    removeUserModalTitle: 'Remove User From Project',
    removeUserButton: 'Remove User',
    cancelButton: 'Cancel',
  },
  submittedForm: {
    sampleUnitsAreReadOnly: 'Submitted sample units are read-only.',
    moveSampleUnitButton: 'Edit Sample Unit — move to Collecting',
    adminEditOnly:
      'Submitted sample units are read-only and can only be moved to Collecting by an admin.',
  },
  collectTable: {
    title: 'Collecting',
    filterToolbarText: 'Filter this table by method, site, management, or observer',
    noDataMainText: `You do not have any active sample units`,
  },
  siteForm: {
    title: 'Site',
  },
  siteTable: {
    controlZoomText: 'Use Ctrl + Scroll to zoom the map',
    copySitesButtonText: 'Copy sites from other projects',
    filterToolbarText: 'Filter this table by name, reef type, reef zone, or exposure.',
    noDataMainText: 'This project has no sites.',
    title: 'Sites',
  },
  managementRegimeForm: {
    title: 'Management Regime',
  },
  managementRegimeTable: {
    copyManagementRegimeButtonText: 'Copy MRs from other projects',
    filterToolbarText: 'Filter this table by name or year',
    noDataMainText: `This project has no Management Regimes.`,
    title: 'Management Regimes',
  },
  usersAndTransectsTable: {
    title: 'Observers and Transects',
    filterToolbarText: 'Filter this table by site or method',
    missingSiteName: '(Missing Site Name)',
    missingMRName: '(Missing MR Name)',
    missingLabelNumber: 'missing number',
    noDataMainText: 'This project has no submitted sample units yet.',
    noDataSubTextTitle: 'This page will show:',
    noDataSubTexts: [
      'Who has unsubmited sample units',
      'Which sample units are missing',
      'Transect number for submitted and unsubmitted sample units',
    ],
  },
  managementRegimesOverview: {
    title: 'Management Regimes Overview',
    noDataMainText: 'This project has no submitted sample units yet.',
    noDataSubText:
      'This page will show the Management Regime of submitted sample units by method and site.',
  },
  copySiteTable: {
    title: 'Copy Sites',
    filterToolbarText: 'Filter this table by name, project, or country',
    copyButtonText: 'Copy selected sites to project',
  },
  copyManagementRegimeTable: {
    title: 'Copy Management Regimes',
    filterToolbarText: 'Filter management regimes by name, project, or year',
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

const popoverTexts = {
  noSampleUnitMatch: 'No Sample Units match:',
  viewSubmittedSampleUnit: 'View submitted Sample Unit',
  notSubmittedSampleUnit: `This Sample Unit is not submitted`,
  inCollectingWith: 'In Collecting with:',
}

const getResolveModalLanguage = (siteOrManagementRegime) => {
  return {
    original: `Original ${siteOrManagementRegime}`,
    duplicate: `Duplicate ${siteOrManagementRegime}`,
    keepEither: `Keep ${siteOrManagementRegime}`,
    editEither: `Edit ${siteOrManagementRegime}`,
    keepBoth: 'Keep both',
    cancel: 'Cancel',
    merge: 'Merge',
    getConfirmMergeMessage: (anotherSite) =>
      `All instances of this site will be replaced with ${anotherSite}`,
  }
}

const getValidationMessage = (validation, projectId = '') => {
  const { code, context, name } = validation

  const validationMessages = {
    all_attributes_same_category: () => `All benthic attributes are ${context?.category}`,
    all_equal: () => 'All observations are the same',
    diff_num_quadrats: () => 'Defined number of quadrats does not match',
    duplicate_benthic_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_fishbelt_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_collection: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_transect: () => 'Transect already exists',
    duplicate_values: () => 'Duplicate',
    exceed_total_colonies: () => 'Maximum number of colonies exceeded',
    future_sample_date: () => 'Sample date is in the future',
    high_density: () => `Fish biomass greater than ${context?.biomass_range[1]} kg/ha`,
    incorrect_observation_count: () =>
      `Incorrect number of observations; expected ${context?.expected_count}`,
    interval_size_not_positive: () => 'Interval size must be a positive number',
    invalid_benthic_transect: () =>
      'One or more invalid transect fields: site, management, date, number, depth',
    invalid_depth: () => `Depth invalid or not greater than ${context?.depth_range[0]} m`,
    invalid_fish_count: () => 'Fish count must be a non-negative integer',
    invalid_fish_size: () => `Invalid fish size`,
    invalid_fishbelt_transect: () =>
      'One or more invalid transect fields: site, management, date, number, width, depth',
    invalid_number_of_points: () =>
      `Total number of points entered for quadrats: ${context?.invalid_quadrat_numbers} does not match defined number of points per quadrat`,
    invalid_percent_value: () => 'Percent value must be a non-negative number',
    invalid_quadrat_collection: () =>
      'One or more invalid transect fields: site, management, date, depth',
    invalid_quadrat_size: () => 'Invalid quadrat size',
    invalid_quadrat_transect: () =>
      'One or more invalid transect fields: site, management, date, number, depth',
    invalid_sample_date: () => 'Invalid date',
    invalid_score: () => `Invalid score`,
    invalid_total_percent: () => `Sum of percents must not be less than 0 or greater than 100`,
    large_num_quadrats: () => 'Number of quadrats is too large',
    len_surveyed_not_positive: () => 'Transect length must be a non-negative number',
    len_surveyed_out_of_range: () =>
      `Transect length surveyed value outside range of ${context?.len_surveyed_range[0]} and ${context?.len_surveyed_range[1]}`,
    low_density: () => `Fish biomass less than ${context?.biomass_range[0]} kg/ha`,
    management_not_found: () => 'Management Regime not available for similarity validation.',
    max_depth: () => `Depth exceeds ${context?.depth_range[1]} m`,
    max_fish_size: () => 'Fish size is larger than maximum observed size',
    minimum_total_fish_count: () => `Total fish count less than ${context?.minimum_fish_count}`,
    missing_quadrat_numbers: () => `Missing quadrat numbers ${context?.missing_quadrat_numbers}`,
    no_region_match: () => 'Coral or fish not previously observed in site region',
    not_part_of_fish_family_subset: () => `Fish is not part of project-defined fish families`,
    not_positive_integer: () => 'Value is not greater or equal to zero',
    not_unique_site: () => 'Site: Similar records detected',
    not_unique_management: () => goToManagementOverviewPageLink(projectId),
    obs_total_length_toolarge: () =>
      `Total length of observations (${context?.total_obs_length} cm) is greater than the transect length (${context?.len_surveyed} m) + 50%`,
    obs_total_length_toosmall: () =>
      `Total length of observations (${context?.total_obs_length} cm) is less than 50% of the transect length (${context?.len_surveyed} m)`,
    required: () => `Required`,
    required_management_rules: () =>
      'At least one rule must be specified for this Management Regime.',
    sample_time_out_of_range: () =>
      `Sample time outside of range ${context?.time_range[0]} and ${context?.time_range[1]}`,
    similar_name: () => 'Another Management Regime is similar to this one.',
    site_not_found: () => 'Site record not available for similarity validation',
    too_many_observations: () => `Greater than ${context?.observation_count_range[1]} observations`,
    too_few_observations: () => `Fewer than ${context?.observation_count_range[0]} observations`,
    unsuccessful_dry_submit: () => getSystemValidationErrorMessage(context?.dry_submit_results),
    value_not_set: () => 'Value is not set',
    default: () => code || name,
  }

  return (validationMessages[code] || validationMessages.default)()
}

const helperText = {
  accessRestrictions:
    'Access is restricted, e.g., people outside a community are not allowed to fish here',
  compliance: 'Effectiveness of the rules in the managed area - low compliance to high compliance',
  current: 'Water speed during the survey.',
  depth: 'Depth of sample unit, in meters (e.g. 3).',
  exposure: '',
  fishSizeBin:
    'Name of bin scheme used to estimate fish size for the transect. Choose 1 cm if the fish size recorded does not use bins.',
  gearRestrictions: 'There are restrictions on what types of fishing gear can be used',
  intervalSize:
    'Distance between observations on a transect, in meters. May include decimal (e.g. 0.5).',
  intervalStart:
    'Interval counted as the first observation on a transect, in meters. May include decimal (e.g. 0.5). Default is interval size (i.e. not counting 0).',
  label:
    'Arbitrary text to distinguish sample units that are distinct but should be combined analytically (i.e. all other properties are identical). For example: Long swim. Rarely used.',
  latitude: () => (
    <>
      Latitude in decimal degrees. Should be a number between -90 and 90, representing the
      north-south position on the Earth&apos;s surface. A positive value indicates a location north
      of the equator, while a negative value indicates a location south of the equator. If you need
      to convert from degrees-minutes-seconds, an online calculator is{' '}
      <HelperTextLink
        href="https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees"
        target="_blank"
      >
        here.
      </HelperTextLink>
    </>
  ),
  longitude: () => (
    <>
      Latitude in decimal degrees. Should be a number between -90 and 90, representing the
      north-south position on the Earth&#39;s surface. A positive value indicates a location north
      of the equator, while a negative value indicates a location south of the equator. If you need
      to convert from degrees-minutes-seconds, an online calculator is{' '}
      <HelperTextLink
        href="https://www.latlong.net/degrees-minutes-seconds-to-decimal-degrees"
        target="_blank"
      >
        here.
      </HelperTextLink>
    </>
  ),
  management:
    'The management designation at the time of survey, e.g., no-take zone, partial restrictions, or open access.',
  managementRegimeName: () => (
    <>
      Name of the MPA, OECM, or other relevant managed area. Can be an official name defined by a
      governmental or standardized source such as{' '}
      <HelperTextLink href="http://protectedseas.net/" target="_blank">
        protectedseas.net
      </HelperTextLink>
      ; alternatively, a descriptive local label like &#39;Northeast Point seasonal closure&#39;can
      be used.
    </>
  ),
  name: 'Name or ID used to refer to this site. A name can be any label useful to the project; often, projects will use a systematic naming scheme that includes indication of reef zone/type and a numbering system. Using the same name consistently across projects and years will facilitate temporal analyses.',
  noTake: 'Total extraction ban',
  notes: '',
  number: 'Number of quadrat in sample unit collection (e.g. 1).',
  numberOfPointsPerQuadrat: 'Total number of points per quadrat used in a transect (e.g. 100).',
  numberOfQuadrats: 'Total number of quadrats in the transect (e.g. 10).',
  openAccess: 'Open for fishing and entering',
  partialRestrictions:
    'e.g. periodic closures, size limits, gear restrictions, species restrictions',
  parties: 'Who is responsible for managing this area.',
  periodicCloser:
    'The area is open and closed as a fisheries management strategy, e.g., rotating octopus closures',
  quadratSize: 'Quadrat size used per transect, in square meters (e.g. 1).',
  reefSlope: () => (
    <>
      An indication of coral reef profile of the survey location. See definitions{' '}
      <HelperTextLink
        href="https://reefresilience.org/wp-content/uploads/REEF-COVER-CLASS-DEFINITIONS.pdf"
        target="_blank"
      >
        here.
      </HelperTextLink>
    </>
  ),
  reefType: () => (
    <>
      The geomorpholgy of a reef and its relation to land. See definitions{' '}
      <HelperTextLink
        href="https://www.livingoceansfoundation.org/wp-content/uploads/2015/04/U10-Reef-Types-complete-teacher.pdf"
        target="_blank"
      >
        here.
      </HelperTextLink>
    </>
  ),
  reefZone: () => (
    <>
      Location and abiotic factors that characterize the location within the reef. See definitions{' '}
      <HelperTextLink
        href="https://www.livingoceansfoundation.org/wp-content/uploads/2015/04/U11-Reef-Zonation-Background.pdf"
        target="_blank"
      >
        here.
      </HelperTextLink>
    </>
  ),
  relativeDepth: () => (
    <>
      Whether the survey is &#39;deep&#39; or &#39;shallow&#39; relative to other transects
      surveyed, regardless of numerical depth in meters.
    </>
  ),
  sampleDate: 'Date when data was collected',
  sampleTime: 'Time when data was collected',
  secondaryName: 'Optional secondary name, e.g., Nusa Penida Fisheries Zone',
  site: 'A unique name of a site where data was collected.',
  siteName:
    'Name or ID used to refer to this site. A name can be any label useful to the project; often, projects will use a systematic naming scheme that includes indication of reef zone/type and a numbering system. Using the same name consistently across projects and years will facilitate temporal analyses.',
  sizeLimits: 'There are restrictions on the size of certain target species',
  speciesRestrictions: 'There are restrictions on what types of species can be caught',
  tide: () => (
    <>
      Tide characteristics during the survey{' '}
      <HelperTextLink
        href="https://oceanservice.noaa.gov/education/tutorial_tides/tides01_intro.html"
        target="_blank"
      >
        (more detail).
      </HelperTextLink>
    </>
  ),
  transectLengthSurveyed:
    'Length of transect for a sample unit, in meters. May include decimal (e.g. 50.0).',
  transectNumber:
    'Sample unit number, as integer (e.g. 1). Typically, sample units are numbered consecutively at each site, with the same number per site in a project.',
  visibility: 'The horizontal distance at which an object underwater can still be identified. ',
  width:
    'The total width (NOT width to one side of the tape) of the fish belt transect, in meters.',
}

const tooltipText = {
  admin: 'An admin can manage users, data sharing, and edit submitted data',
  benthicAttribute: () => (
    <>
      Benthic attribute observed. A benthic attribute can be a taxonomic name for a coral or other
      sessile organism, or an abiotic classification. MERMAID benthic attributes are organized
      hierarchically and are consistent with{' '}
      <HelperTextLink href="https://www.marinespecies.org/" target="_blank" color="#fff">
        WoRMS.
      </HelperTextLink>
    </>
  ),
  collector: 'A collector can only create and submit data',
  fishName: () => (
    <>
      Name of the fish species, genus, or family observed. For genus-level observations or an
      unknown species, enter the genus rather than proposing a new species with &lsquo;spp&lsquo;.
      All fish names in MERMAID are consistent with{' '}
      <HelperTextLink href="https://fishbase.mnhn.fr/search.php" target="_blank" color="#fff">
        fishbase.
      </HelperTextLink>
    </>
  ),
  fishSize: 'Size of fish observed, in cm (e.g. 4.5 or 5-10).',
  fishCount: 'Number of fish observed, of the same species/genus/family and size.',
  readOnly: 'A read-only user can only view and download the data',
}

export default {
  apiDataTableNames,
  autocomplete,
  clearSizeValuesModal,
  createNewOptionModal,
  deleteRecord,
  error,
  getResolveModalLanguage,
  getValidationMessage,
  header,
  helperText,
  inlineMessage,
  loadingIndicator,
  map,
  popoverTexts,
  navigateAwayPrompt,
  pages,
  projectModal,
  protocolTitles,
  success,
  table,
  title,
  tooltipText,
}

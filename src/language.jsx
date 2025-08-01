// prettier-ignore
import React from 'react'
import { PROJECT_CODES } from './library/constants/constants'
import {
  getDuplicateValuesValidationMessage,
  getDuplicateSampleUnitLink,
  getInvalidBleachingObsMessage,
  getInvalidBleachingObsTotalMessage,
  getObservationsCountMessage,
  getSystemValidationErrorMessage,
  goToManagementOverviewPageLink,
} from './library/validationMessageHelpers'
import { HelperTextLink } from './components/generic/links'
import styled from 'styled-components'
import theme from './theme'

const StyledLink = styled.a`
  cursor: pointer;
`

const StyledHelperLink = styled.a`
  font-size: ${theme.typography.smallFontSize};
`

const acaUrl = 'https://allencoralatlas.org/atlas'
const gfcrPdfUrl = `https://public.datamermaid.org/GFCR-Monitoring-and-Evaluation-Toolkit.pdf?nocache=${Date.now()}`

const AcaLink = () => (
  <StyledHelperLink href={acaUrl} target="_blank">
    Allen Coral Atlas
  </StyledHelperLink>
)
const GfcrPdfLink = () => (
  <>
    <br />
    <StyledHelperLink href={gfcrPdfUrl} target="_blank">
      View M&E Toolkit PDF
    </StyledHelperLink>
  </>
)

const placeholders = {
  select: 'Choose...',
  selectAttribute: 'Select attribute',
}

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

const buttons = {
  addRow: 'Add row',
  cancel: 'Cancel',
  close: 'Close',
  confirm: 'Confirm',
  confirmAll: 'Confirm all',
  saveChanges: 'Save Changes',
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
  formValidation: {
    latitude: 'Latitude should be between -90° and 90°',
    longitude: 'Longitude should be between -180° and 180°',
    required: 'This field is required',
    projectNameExists: 'Project name already exists in MERMAID',
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
  gfcrIndicatorSetsUnavailable: 'GFCR indicator sets are currently unavailable.',
  gfcrIndicatorSetSave: 'Indicator set has not been saved.',
  gfcrIndicatorSetDelete: 'Indicator set has not been deleted.',
  gfcrFinanceSolutionSave: 'Finance solution has not been saved.',
  gfcrFinanceSolutionDelete: 'Finance solution has not been removed.',
  gfcrInvestmentSave: 'Investment has not been saved.',
  gfcrInvestmentDelete: 'Investment has not been removed.',
  gfcrRevenueSave: 'Revenue has not been saved.',
  gfcrRevenueDelete: 'Revenue has not been removed.',
  idNotFoundUserAction: "Please check the URL in your browser's address bar.",
  invalidEmailAdd: 'Invalid email address.',
  managementRegimeRecordsUnavailable: 'Management Regime records data are currently unavailable.',
  managementRegimeRecordUnavailable: 'Management Regime record data are currently unavailable.',
  notificationsUnavailable: 'Notifications are unavailable.',
  notificationNotDeleted: 'Notification could not be removed.',
  notificationsNotDeleted: 'Notifications could not be removed',
  projectDelete: 'This project has not been deleted.',
  projectAddGfcr: 'Could not add GFCR indicators to the project.',
  projectRemoveGfcr: 'Could not remove GFCR indicators from the project.',
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
  pageAdminOnly: 'You cannot access this page because you are not an admin for this project.',
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
  noLocationMermaidExplore: 'No location found in MERMAID Explore.',
  noProjectMermaidExplore: 'No project found in MERMAID Explore.',
}

const success = {
  collectRecordSave: 'Record saved.',
  collectRecordSubmit: 'Record submitted.',
  collectRecordValidated: 'Record successfully validated.',
  collectRecordDelete: 'Record deleted.',
  newOrganizationAdd: 'Organization added.',
  getProjectTurnOnOfflineReadySuccess: (projectName) => `${projectName} is now offline ready`,
  getProjectTurnOffOfflineReadySuccess: (projectName) =>
    `${projectName} has been removed from being offline ready`,
  getUserRoleChangeSuccessMessage: ({ userName, role }) =>
    `${userName}'s role is now set to ${role}.`,
  gfcrIndicatorSetSave: 'Indicator set saved.',
  gfcrIndicatorSetDelete: 'Indicator set deleted.',
  gfcrFinanceSolutionSave: 'Finance solution row saved.',
  gfcrFinanceSolutionDelete: 'Finance solution row removed.',
  gfcrInvestmentSave: 'Investment row saved.',
  gfcrInvestmentDelete: 'Investment row removed.',
  gfcrRevenueSave: 'Revenue row saved.',
  gfcrRevenueDelete: 'Revenue row removed.',
  newUserAdd: 'New user added.',
  newPendingUserAdd: 'Sign-up email sent. New user added as Pending User.',
  userRemoved: 'User removed',
  projectSave: 'Project saved',
  projectAddGfcr: 'Added GFCR indicators to project',
  projectRemoveGfcr: 'Removed GFCR indicators from project',
  projectDeleted: 'Project deleted',
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

const deleteProject = (project) => {
  return {
    title: `Delete project`,
    prompt: `Are you sure you want to delete ${project}?`,
    yes: `Delete ${project}`,
    no: 'Cancel',
    hasSampleUnits: 'You must delete all the sample units in this project to delete this project.',
    hasOtherUsers: 'Other users must be removed from this project before deletion.',
    confirmDeleteText1: `You cannot delete this ${project} because it is used in the following sample units:`,
    confirmDeleteText2: `You have to remove this ${project} from all sample units before you can delete it.`,
  }
}

const loadingIndicator = {
  loadingPrimary: 'Loading',
  loadingSecondary: 'Still working...',
}

const createNewOptionModal = {
  genus: 'Genus',
  contactForHelp: 'Contact us for help',
  species: 'Species',
  newBenthicAttribute: 'Benthic attribute',
  benthicAttributeParent: 'Parent',
  newBenthicAttributeName: 'Name',
  goToNextPage: 'Next',
  cancel: 'Cancel',
  back: 'Back',
  details: 'Details',
  user: 'User',
  project: 'Project',
  submit: 'Send to MERMAID for review',
}

const gfcrFinanceSolutionModal = {
  titleAdd: 'Add Business / Finance Solution',
  titleUpdate: 'Update Finance Solution',
  name: 'Business / Finance solution name',
  getNameHelper: () => (
    <>
      Enter the name of each business or financial solution financed by the GFCR Programme
      separately. You may copy solutions from previous reports. Indicators F8, F9, and F10 will be
      disaggregated by both solution and sector. New solutions financed by the Programme will be
      added here progressively. <GfcrPdfLink />
    </>
  ),
  sector: 'Sector',
  getSectorHelper: () => (
    <>
      Enter the sector of the solution in this GFCR Programme. Refer to the Annex 3 of the GFCR M&E
      Toolkit for details. <GfcrPdfLink />
    </>
  ),
  usedAnIncubator: 'Used an incubator?',
  getUsedAnIncubatorHelper: () => (
    <>
      Indicate if the solution utilized an incubator for early-stage support and access to
      resources. Specify whether the incubator was funded by GFCR. <GfcrPdfLink />
    </>
  ),
  localEnterprise: 'Local enterprise',
  getLocalEnterpriseHelper: () => (
    <>
      Defined as a small to medium-sized business operating within the specific location of the GFCR
      Programme. This applies to F9.3 (Amount (and %) of revenue in local enterprises), which
      measures the revenue that is retained within a local geography, differing from revenue that is
      transferred overseas. <GfcrPdfLink />
    </>
  ),
  genderSmart: 'Gender 2X Criteria',
  getGenderSmartHelper: () => (
    <>
      Indicate if the solution qualifies under at least one 2X Challenge Criterion. Refer to the{' '}
      <StyledHelperLink href="https://www.2xchallenge.org/2xcriteria" target="_blank">
        2X Criteria Reference Guide
      </StyledHelperLink>{' '}
      for details. This applies to F10 (Number of gender-smart investments), which measures GFCR
      support for gender equality through investments meeting 2X Challenge standards.{' '}
      <GfcrPdfLink />
    </>
  ),
  sustainableFinanceMechanisms: 'Sustainable finance mechanisms',
  getSustainableFinanceMechanismsHelper: () => (
    <>
      Financing that generates a significant, recurring revenue stream directed toward conservation
      or sustainable ecosystem management. This applies to F8.5 (Number and type of sustainable
      finance mechanisms). Select all applicable options, as one solution may include multiple
      mechanisms. <GfcrPdfLink />
    </>
  ),
  notes: 'Notes',
  add: 'Add Business / Finance Solution Row',
  save: 'Save Business / Finance Solution Row',
  cancel: 'Cancel',
  remove: 'Remove Row',
  yes: 'Yes',
  no: 'No',
}

const gfcrInvestmentModal = {
  titleAdd: 'Add Investment',
  titleUpdate: 'Update Investment',
  financeSolution: 'Business / Finance solution',
  getFinanceSolutionHelper: () => (
    <>
      Select the business or financial solution financed by the GFCR Programme to report investment.
      Report investment separately for each solution, disaggregated by source and type. This applies
      to F8 (Amount of public, private, and philanthropic funding mobilized by the GFCR).{' '}
      <GfcrPdfLink />
    </>
  ),
  investmentSource: 'Investment source',
  getInvestmentSourceHelper: () => (
    <>
      For each solution, enter investment amount separately by source (e.g., GFCR, philanthropy,
      public, or private). If a solution received investment from multiple sources (e.g., GFCR and
      private), add a separate entry for each. This applies to F8 (Amount of public, private, and
      philanthropic funding mobilized by the GFCR). <GfcrPdfLink />
    </>
  ),
  investmentType: 'Investment type',
  getInvestmentTypeHelper: () => (
    <>
      For each solution, enter the investment amount from a single source by type. If a solution
      received different types of investment from one source (e.g., grant and technical assistance
      from GFCR), add a separate entry for each type. This applies to F8 (Amount of public, private,
      and philanthropic funding mobilized by the GFCR). <GfcrPdfLink />
    </>
  ),
  investmentAmount: 'Investment amount',
  getInvestmentAmountHelper: () => (
    <>
      Enter the investment amount in US dollars as cumulative total since the start of the GFCR
      Programme. This applies to F8 (Amount of public, private, and philanthropic funding mobilized
      by the GFCR). <GfcrPdfLink />
    </>
  ),
  notes: 'Notes',
  add: 'Add Investment Row',
  save: 'Save Investment Row',
  cancel: 'Cancel',
  remove: 'Remove Row',
}

const gfcrRevenueModal = {
  titleAdd: 'Add Revenue Stream',
  titleUpdate: 'Update Revenue Stream',
  financeSolution: 'Business / Finance solution',
  getFinanceSolutionHelper: () => (
    <>
      Select the business or financial solution financed by the GFCR Programme to report revenue.
      Report revenue separately for each solution, disaggregated by type. This applies to F9 (Amount
      of revenue and Return on Investment). <GfcrPdfLink />
    </>
  ),
  revenueType: 'Revenue type',
  getRevenueTypeHelper: () => (
    <>
      For each solution, enter revenue amounts by type. If a solution generated multiple revenue
      types (e.g., blue bonds, biodiversity credits), add a separate entry for each. This applies to
      F9.1 (Amount of revenue and ROI from business/financial solution returns and sustainable
      financing by type). <GfcrPdfLink />
    </>
  ),
  sustainableRevenueStream: 'Sustainable revenue stream',
  getSustainableRevenueStreamHelper: () => (
    <>
      Defined as revenue that is consistently and predictably generated over the long term that
      allows the business to achieve financial stability. Select option for each revenue type per
      solution. This applies to F9.2 (Number, type, and monetary amount of sustainable revenue
      streams). <GfcrPdfLink />
    </>
  ),
  annualRevenue: 'Revenue amount',
  getAnnualRevenueHelper: () => (
    <>
      Enter the revenue amount in US dollars as cumulative total since the start of the GFCR
      Programme. This applies to F9 (Amount of revenue and Return on Investment). <GfcrPdfLink />
    </>
  ),
  notes: 'Notes',
  add: 'Add Revenue Row',
  save: 'Save Revenue Row',
  cancel: 'Cancel',
  remove: 'Remove Row',
  yes: 'Yes',
  no: 'No',
}

const gfcrNewIndicatorSetModal = {
  title: 'Create Indicator Set',
  create: 'Create Indicator Set',
  cancel: 'Cancel',
  titleInput: 'Title',
  dateInput: 'Date',
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
  addNewRow: 'Add new row',
  addExistingRow: 'Add to existing row',
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
  admin: {
    accessible_information: 'Accessible Information',
    admin: 'Admin',
    collector: 'Collector',
    readOnly: 'Read-Only',
    projectManagement: 'Project management',
    projectInfo: {
      edit: 'Edit project info',
      setUpDataSharing: 'Set up data sharing policy',
      addOrRemoveProjectMembers: 'Add or remove project members',
      viewMemberEmail: 'View project member email',
      delete: 'Delete a project',
    },
    dataCollection: {
      title: 'Data collection and management',
      addUpdateSiteOrRegimes: 'Add/update site or management regimes',
      deleteSiteOrRegimes: 'Delete site or management regimes',
      downloadSitesAndRegimes: 'Download sites and management regimes',
      createValidateSubmitSampleUnits: 'Create, validate, and submit sample units',
      deleteSampleUnits: 'Delete unsubmitted sample units',
      editSampleUnits: 'Edit submitted sample units',
      transferSampleUnits: 'Transfer unsubmitted sample units',
      downloadSampleUnits: 'Download submitted sample units',
      viewObserversAndSampleUnits: 'View observers and sample units overview',
      viewRegimesOverview: 'View management regimes overview',
    },
  },
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
    noDataSubText: `Create a new project or get your admin to add you to some.`,
    readOnlyUserWithActiveSampleUnits:
      'You cannot submit these collect records because you only have read-only access to this project. Please contact the project admin.',
  },
  collectRecord: {
    title: 'Collecting',
    newFishSpeciesLink: 'Propose New Species...',
    totalAbundanceLabel: 'Total Abundance',
    totalBiomassLabel: 'Total Biomass (kg/ha)',
    newBenthicAttributeLink: 'Propose New Benthic Attribute...',
    viewLink: 'View',
    formSectionTitle: {
      sampleEvent: 'Sample Event',
      quadratCollection: 'Quadrat Collection',
      observers: 'Observers',
      transect: 'Transect',
    },
    observersSelectHelper: 'Select one or more observers to add',
    getObserverRemovedFromProjectMessage: (userName) => (
      <>
        <strong>{userName}</strong> is an observer on this sample unit but is no longer a part of
        this project.
      </>
    ),
    removeObserverFromCollectRecord: 'Remove as observer',
    removeObserverModal: {
      title: 'Remove observer from record',
      getModalContent: (userName) => (
        <>
          Are you sure you want to remove <strong>{userName}</strong> as an observer?
        </>
      ),
      removeObserverSubmitButton: 'Remove user',
      removeObserverCancelButton: 'Cancel',
    },
    fishNamePopover: {
      family: 'Family',
      biomasConstants: 'Biomass Constants',
      maxLength: 'Max Length (cm)',
      groupSize: 'Group Size',
      maxType: 'Max Type',
      functionalGroup: 'Functional Group',
      trophicGroup: 'Trophic Group',
    },
    benthicPitSyncCheckbox: 'Use Interval Size as Interval Start',
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
    gfcrCallout: {
      calloutHeading: 'Global Fund for Coral Reefs (GFCR)',
      removeParagraph:
        'Removing GFCR indicators from this project will not delete them, but just hide them.',
      addParagraph:
        'GFCR is a global partnership that aims to mobilize resources to support coral reef conservation and restoration projects around the world. ',
      disableButton: 'Disable GFCR Indicators',
      enableButton: 'Enable GFCR Indicators for this project',
      goToButton: 'Go to GFCR Indicators',
    },
    citationLabel: 'Suggested Citation',
    citationHelperText:
      'Citation to suggest for all uses of your project data. This citation will be displayed on MERMAID Explore and with any other data access method. ',
    editCitation: 'Edit Citation',
    editCitationModal: {
      title: 'Edit Suggested Citation',
      helper: 'Copy and paste project info into your citation',
      projectName: 'Project Name',
      projectAdmins: 'Project Admins',
      projectAdmin: 'Project Admin',
      otherProjectMembers: 'Other Project Members',
      otherProjectMember: 'Other Project Member',
      projectLastUpdated: 'Project Last Updated',
      countries: 'Countries',
      country: 'Country',
      editCitation: 'Edit Citation',
      cancel: 'Cancel',
      updateCitation: 'Update Citation',
      citationPreview: 'Citation Preview',
      useDefaultCitation: 'Use Default Citation',
    },
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
    filterToolbarText: 'Filter this table by site, management, or observer',
    noDataMainText: `This project has no submitted sample units.`,
    filterSearchHelperText: {
      __html: `
        <span style="font-weight: bold;">Use double quotes to search exact phases.</span><br>
        For example, search North Shore to find records with the words North or Shore (records with South Shore would match). Or search “North Shore” to find records that have exactly the words North Shore (records with South Shore would not match).
      `,
    },
  },
  userTable: {
    title: 'Users',
    introductionParagraph:
      'MERMAID gives you the ability to control who can see and access your data.',
    moreInfoTitle: 'User Roles',
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
    filterToolbarText: 'Filter this table by site, management, or observer',
    noDataMainText: `You do not have any active sample units`,
  },
  siteForm: {
    title: 'Site',
    nonAdminDelete: 'Only admins can delete a site.',
    placeMarker: 'Place Site Marker',
    swapButton: 'Swap',
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
    nonAdminDelete: 'Only admins can delete a management regime.',
  },
  managementRegimeTable: {
    copyManagementRegimeButtonText: 'Copy MRs from other projects',
    filterToolbarText: 'Filter this table by name or year',
    noDataMainText: `This project has no Management Regimes.`,
    title: 'Management Regimes',
  },
  usersAndTransectsTable: {
    title: 'Sample Units / Observers',
    navTitle: (
      <>
        Sample Units / <br /> Observers
      </>
    ),
    filterToolbarText: 'Filter this table by site',
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
    navTitle: (
      <>
        Sample Units / <br /> Management Regimes
      </>
    ),
    title: 'Sample Units / Management Regimes',
    tableSubSectionTitle: 'Submitted / Management Regime',
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
  gfcrTable: {
    filterToolbarText: 'Filter this table by title or date',
    createIndicatorSetTitle: 'Create Indicator Set',
    title: 'GFCR',
    noDataMainText: 'No indicator sets yet.',
    noDataSubText: "Select 'Create new' to add an indicator set to this project.",
  },
  gfcrFinanceSolutionsTable: {
    add: 'Add Business / Finance Solution',
    filterToolbarText: 'Filter this table by finance solution',
    noDataMainText: 'No Finance Solutions yet.',
    noDataSubText: "Select 'Add Finance Solution' to add one to this indicator set.",
  },
  gfcrInvestmentsTable: {
    add: 'Add Investment',
    filterToolbarText: 'Filter this table by investment',
    noDataMainText: 'No Investments yet.',
    noDataSubText: "Select 'Add Investment' to add one to this indicator set.",
    getNoFinanceSolutions: (onClick) => (
      <>
        Add a <StyledLink onClick={onClick}>finance solution</StyledLink> before adding investments.
      </>
    ),
  },
  gfcrRevenuesTable: {
    add: 'Add Revenue',
    filterToolbarText: 'Filter this table by revenue',
    noDataMainText: 'No Revenues yet.',
    noDataSubText: "Select 'Add Revenue' to add one to this indicator set.",
    getNoFinanceSolutions: (onClick) => (
      <>
        Add a <StyledLink onClick={onClick}>finance solution</StyledLink> before adding revenues.
      </>
    ),
  },

  gfcrIndicatorSet: {
    title: 'Indicator Set',
    total: 'Total',
    ofTotalHowMany: 'Of the total, how many of the following',
    men: 'Men',
    women: 'Women',
    youth: 'Youth',
    indigenous: 'Indigenous',
    notes: 'Notes',
    indicatorSetTitle: 'Title',
    getIndicatorSetTitleHelperText: () => (
      <>
        Recommended naming conventions:
        <br />
        For target reports, use &quot;Phase 1 Target&quot;, &quot;Mid-term Target&quot;, or
        &quot;Final Target&quot;. For bi-annual progress reports, use &quot;Mid-year Report&quot; or
        &quot;End-year Report&quot;. <GfcrPdfLink />
      </>
    ),
    indicatorSetReportingDate: 'Reporting date',
    getIndicatorSetReportingDateHelperText: () => (
      <>
        End date for the reporting period of the GFCR Programme, e.g., a end-year report may have
        December 31 as the reporting date. <GfcrPdfLink />
      </>
    ),
    f1Heading: 'Coral reef extent of GFCR Programme',
    f1_1: 'Total area of coral reefs in GFCR Programme',
    getF1_1_helper: () => (
      <>
        Total area (km2) of coral reefs within the GFCR Programme area, e.g., calculated from the{' '}
        <AcaLink /> or from another database. Report as cumulative total since the start of the
        Programme.
        <GfcrPdfLink />
      </>
    ),
    f2Heading: 'Area of coral reefs under conservation and sustainable management',
    getF2_1a: () => (
      <>
        <strong>Coral reef area</strong> of MPAs and OECMs (as aligned to GBF Target 3)
      </>
    ),
    getF2_1a_helper: () => (
      <>
        Total area (km2) of coral reefs exclusively within Marine Protected Areas (MPAs) and Other
        Effective area-based Conservation Measures (OECMs) as per the Global Biodiversity Framework
        (GBF) Target 3, within GFCR Programme area, e.g., calculated from the <AcaLink /> or from
        another database. This is different from the total area in F 2.1b. Report as cumulative
        total since the start of the Programme. If GFCR Programme activities are not working on MPAs
        or OECMs, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF2_1b: () => (
      <>
        <strong>Total area</strong> of MPAs and OECMs (as aligned to GBF Target 3)
      </>
    ),
    getF2_1b_helper: () => (
      <>
        Total area (km2) of MPAs and OECMs, including non-coral reef areas, e.g., mangroves,
        seagrass or other associated ecosystems, aligned with GBF Target 3, within GFCR Programme
        area, e.g., calculated from the <AcaLink /> or from another database. Report as cumulative
        total since the start of the Programme. If GFCR Programme activities are not working on MPAs
        or OECMs, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF2_2a: () => (
      <>
        <strong>Coral reef area</strong> of locally managed areas / co-managed areas
      </>
    ),
    getF2_2a_helper: () => (
      <>
        Total area (km2) of coral reefs exclusively under other local management or co-management
        arrangements (not MPAs or OECMs), where local communities have significant involvement in
        management decisions, within GFCR Programme area. This is different to the total area in F
        2.2b. Report as cumulative total since the start of the Programme. If GFCR Programme
        activities are not working on locally managed areas, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF2_2b: () => (
      <>
        <strong>Total area</strong> of locally managed areas / co-managed areas
      </>
    ),
    getF2_2b_helper: () => (
      <>
        Total area (km2) of other locally managed areas (not MPAs or OECMs), including non-coral
        reef areas, e.g., mangroves, seagrass or other associated ecosystems, within GFCR Programme
        area. Report as cumulative total since the start of the Programme. If GFCR Programme
        activities are not working on locally managed areas, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF2_3a: () => (
      <>
        <strong>Coral reef area</strong> of fisheries management
      </>
    ),
    getF2_3a_helper: () => (
      <>
        Total area (km2) of coral reefs in fisheries management areas (not MPAs, OECMs or LMMAs),
        which have specific fisheries management plans, e.g., gear restrictions, catch quotas,
        within GFCR Programme area. This is different to the total area in F 2.3b. Report as
        cumulative total since the start of the Programme. If Programme activities are not working
        on fisheries management within a fisheries managed area, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF2_3b: () => (
      <>
        <strong>Total area</strong> of fisheries management
      </>
    ),
    getF2_3b_helper: () => (
      <>
        Total area (km2) of fisheries management areas (not MPAs, OECMs or LMMAs), including
        non-coral reef areas, e.g., mangroves, seagrass or other associated ecosystems, within GFCR
        Programme area. Report as cumulative total since the start of the Programme. If Programme
        activities are not working on fisheries management within a fisheries managed area, enter
        &apos;0&apos;.
        <GfcrPdfLink />
      </>
    ),
    f2_4: 'Area with pollution mitigation',
    f2_4_helper: 'F2.4 Helper Text',
    getF2_4_helper: () => (
      <>
        Total area (km2) with active pollution mitigation measures in place to reduce pollution
        impacts within GFCR Programme area. Report as cumulative total since the start of the
        Programme. If Programme activities are not working on pollution mitigation, enter
        &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f2_5: 'Area of non-coral reef ecosystems, e.g. mangroves, seagrass or other associated ecosystems',
    getF2_5_helper: () => (
      <>
        Total area (km2) of non-coral reef ecosystems within GFCR Programme area, e.g. mangroves,
        seagrass or other coral reef-associated ecosystems. Report as cumulative total since the
        start of the Programme. <GfcrPdfLink />
      </>
    ),
    f3Heading: 'Area of coral reefs under effective restoration',
    f3_1: 'Area of effective coral reef restoration',
    getF3_1_helper: () => (
      <>
        Total area (km2) of effective coral reef restoration within GFCR Programme area. This is a
        subset of F1.1 and used to measure only the area of coral reef restoration activities in the
        Programme. Report as cumulative total since the start of the Programme. If there is no
        restoration planned within Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f3_2: 'Number of in situ coral reef restoration projects',
    getF3_2_helper: () => (
      <>
        Total number of coral reef restoration projects that are carried out directly in a coral
        reef environment (in situ). Report as cumulative total since the start of the Programme. If
        restoration is not supported by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f3_3: 'Number of coral reef restoration plans, technologies, strategies or guidelines developed',
    getF3_3_helper: () => (
      <>
        Total number of frameworks, protocols or technologies associated to coral reef restoration
        created in the GFCR Programme that can be applied locally or used by third-parties. Report
        as cumulative total since the start of the Programme. If restoration is not supported by
        GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f3_4: 'Number of coral reef restoration trainings',
    getF3_4_helper: () => (
      <>
        Total number of training sessions conducted to educate and empower individuals and
        communities in coral reef restoration techniques. Report as cumulative total since the start
        of the Programme. If restoration is not supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    f3_5: 'Number of people engaged in coral reef restoration',
    getF3_5_men_helper: () => (
      <>
        Total number of men actively involved on a hiring, volunteering or educational basis in
        coral reef restoration activities. Report as cumulative total since the start of the
        Programme. If restoration is not supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF3_5_women_helper: () => (
      <>
        Total number of women actively involved on a hiring, volunteering or educational basis in
        coral reef restoration activities. Report as cumulative total since the start of the
        Programme. If restoration is not supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF3_5_youth_helper: () => (
      <>
        Total number of young people (aged between 15-24, as defined by the United Nations) actively
        involved on a hiring, volunteering or educational basis in coral reef restoration
        activities. Report as cumulative total since the start of the Programme. If restoration is
        not supported by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF3_5_indigenous_helper: () => (
      <>
        Total number of Indigenous people actively involved on a hiring, volunteering or educational
        basis in coral reef restoration activities. Report as cumulative total since the start of
        the Programme. If restoration is not supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    f3_6: 'Number of response plans to support coral reef restoration after severe shocks',
    getF3_6_helper: () => (
      <>
        Total number of plans, including financial mechanisms, e.g., insurance, to aid in coral reef
        restoration efforts following severe environmental shocks, e.g., storms, bleaching. Report
        as cumulative total since the start of the Programme. If there are no response plans or
        restoration not supported by Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f4Heading: 'Change in coral reef health',
    f4_1: 'Average live hard coral cover',
    getF4_1_helper: () => (
      <>
        This is automatically calculated for all submitted benthic surveys in this GFCR project
        within the reporting date range. If no surveys are submitted for this GFCR project on
        MERMAID, you can enter the value manually. If recent surveys are unavailable for this
        period, enter the previously reported average. <GfcrPdfLink />
      </>
    ),
    f4_2: 'Average macroalgae cover',
    getF4_2_helper: () => (
      <>
        This is automatically calculated for all submitted benthic surveys in this GFCR project
        within the reporting date range. If no surveys are submitted to this GFCR project on
        MERMAID, you can enter the value manually. If recent surveys are unavailable for this
        period, enter the previously reported average. <GfcrPdfLink />
      </>
    ),
    f4_3: 'Average reef fish biomass',
    getF4_3_helper: () => (
      <>
        This is automatically calculated for all submitted fish surveys in this GFCR project within
        the reporting date range. If no surveys are submitted to this GFCR project on MERMAID, you
        can enter the value manually. If recent surveys are unavailable for this period, enter the
        previously reported average. <GfcrPdfLink />
      </>
    ),
    f4_valueFromMermaidData: 'This value is from MERMAID data in this project',
    f4_valueDifferentFromCalc: 'This value is different from what was calculated in this project',
    f4_noValue: 'No value for this date range. Updating the value to 0',
    f4_reportingDateRange: 'Reporting date range',
    f4_start_date: 'Start Date',
    f4_end_date: 'End Date',
    f4_saveAndUpdateValues: 'Save and update values with data from this project',
    f4_couldNotGetCalcValues: 'Could not get values from project for',
    f5Heading:
      'Number of communities engaged in meaningful participation, co-development and capacity strengthening',
    getF5_1: () => (
      <>
        Number of <strong>local communities</strong> engaged in meaningful participation and
        co-development
      </>
    ),
    getF5_1_helper: () => (
      <>
        Total number of communities supported with opportunities to participate and co-develop GFCR
        Programme/blended finance investments. A community can be defined as groups of people who
        share common characteristics, interests, or geographical locations and may be the target
        beneficiaries/stakeholder of Programme. Report as cumulative total since the start of the
        Programme. If communities are not directly supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF5_2: () => (
      <>
        Number of <strong>local organizations</strong> engaged in meaningful participation and
        co-development
      </>
    ),
    getF5_2_helper: () => (
      <>
        Total number of local organizations supported with opportunities to participate in and
        co-develop GFCR Programme, where a local organization is defined as a community-based entity
        operating within a specific geographical area, often with a focus on addressing local needs
        and advancing the well-being of the immediate community. Report as cumulative total since
        the start of the Programme. If local organizations are not directly supported by GFCR
        Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f5_3: 'Number of local scientific/research partners involved in strengthening capacity for participation and co-development',
    getF5_3_helper: () => (
      <>
        Total number of local scientific/research partnerships (including national universities,
        regional science organizations or other research hubs) supported with opportunities to
        participate in and co-develop GFCR Programme and support capacity building with local GFCR
        partners. Report cumulative total since the start of the Programme. If local
        scientific/research partnerships are not directly supported by GFCR Programme, enter
        &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f5_4: 'Number of local practitioners trained / supported in coral reef conservation and management',
    getF5_4_men_helper: () => (
      <>
        Total number of local male practitioners (e.g., community rangers, coastal guardians, MPA
        managers, etc) trained or supported in coral reef conservation and management by GFCR
        Programme. Report cumulative total since the start of the Programme. If men are not trained
        or directly supported by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF5_4_women_helper: () => (
      <>
        Total number of local female practitioners (e.g., community rangers, coastal guardians, MPA
        managers, etc) trained or supported in coral reef conservation and management by GFCR
        Programme. Report cumulative total since the start of the Programme. If women are not
        trained or directly supported by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF5_4_youth_helper: () => (
      <>
        Total number of local young (aged between 15-24, as defined by the United Nations)
        practitioners (e.g., community rangers, coastal guardians, MPA managers, etc) trained or
        supported in coral reef conservation and management by GFCR Programme. Report cumulative
        total since the start of the Programme. If young people are not trained or directly
        supported by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF5_4_indigenous_helper: () => (
      <>
        Total number of local Indigenous practitioners (e.g., community rangers, coastal guardians,
        MPA managers, etc) trained or supported in coral reef conservation and management by GFCR
        Programme. Report cumulative total since the start of the Programme. If Indigenous people
        are not trained or directly supported by GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    f5_5: 'Number of agreements with local authorities or fishing cooperatives to manage marine resources',
    getF5_5_helper: () => (
      <>
        Total number of formal agreements with local organizations to support marine management
        through GFCR program, that may include agreements to support or develop LMMAs, MPAs or
        OECMs. Agreements are defined as formal documents, serving as a framework for collaboration
        (e.g., a memorandum of understanding, MOU, or a management plan). Report cumulative total
        since the start of the Programme. If agreements are not supported by GFCR Programme, enter
        &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f5_6: 'Number of national policies linked to GFCR engagement',
    getF5_6_helper: () => (
      <>
        Total number of national policies directly associated with GFCR engagement, e.g., has the
        GFCR Programme organized a policy workshop directly related to national policy or provided
        other investments associated with a policy outcome. If Programmes are not planning national
        policy targets, or policy is underway but not yet finalized, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    f6Heading: 'Number of people supported through livelihoods, direct jobs, income, and nutrition',
    f6_1: 'Number of direct jobs created',
    getF6_1_men_helper: () => (
      <>
        Total number of local jobs created for men by GFCR businesses or finance solutions. Jobs
        should be considered for each business activity supported by GFCR Programme. Report as
        cumulative total since the start of the Programme. If local jobs are not directly created by
        GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF6_1_women_helper: () => (
      <>
        Total number of local jobs created for women by GFCR businesses or finance solutions. Jobs
        should be considered for each business activity supported by GFCR Programme. Report as
        cumulative total since the start of the Programme. If local jobs are not directly created by
        GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF6_1_youth_helper: () => (
      <>
        Total number of local jobs created for young people (aged between 15-24, as defined by
        United Nations) by GFCR businesses or finance solutions. Jobs should be considered for each
        business activity supported by GFCR Programme. Report as cumulative total since the start of
        the Programme. If local jobs are not directly created by GFCR Programme, enter
        &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF6_1_indigenous_helper: () => (
      <>
        Total number of local jobs created for Indigenous people by GFCR businesses or finance
        solutions. Jobs should be considered for each business activity supported by GFCR Programme.
        Report as cumulative total since the start of the Programme. If local jobs are not directly
        created by GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f7Heading:
      'Number of people supported to better adapt, respond and recover to the effects of climate change and major external shocks as a result of GFCR',
    getF7_1: () => (
      <>
        Total <strong>direct beneficiaries</strong>
      </>
    ),
    getF7_1_men_helper: () => (
      <>
        Direct male beneficiaries that can be identified as the number of men receiving direct
        support from GFCR Programme, e.g., employment, loans, improved incomes or livelihoods, or
        other targeted benefits that improves their livelihoods and thus their ability to adapt to
        climate change. Report as cumulative total since the start of the Programme. If there are no
        direct beneficiaries from GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF7_1_women_helper: () => (
      <>
        Direct female beneficiaries that can be identified as the number of women receiving direct
        support from GFCR Programme, e.g., employment, loans, improved incomes or livelihoods, or
        other targeted benefits that improves their livelihoods and thus their ability to adapt to
        climate change. Report as cumulative total since the start of the Programme. If there are no
        direct beneficiaries from GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF7_1_youth_helper: () => (
      <>
        Direct young beneficiaries that can be identified as the number of young people (aged
        between 15-24, as defined by United Nations) receiving direct support from GFCR Programme,
        e.g., employment, loans, improved incomes or livelihoods, or other targeted benefits that
        improves their livelihoods and thus their ability to adapt to climate change. Report as
        cumulative total since the start of the Programme. If there are no direct beneficiaries from
        GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF7_1_indigenous_helper: () => (
      <>
        Direct indigenous beneficiaries that can be identified as the number of Indigenous people
        receiving direct support from GFCR Programme, e.g., employment, loans, improved incomes or
        livelihoods, or other targeted benefits that improves their livelihoods and thus their
        ability to adapt to climate change. Report as cumulative total since the start of the
        Programme. If there are no direct beneficiaries from GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF7_2: () => (
      <>
        Total <strong>indirect beneficiaries</strong>
      </>
    ),
    getF7_2_men_helper: () => (
      <>
        Indirect male beneficiaries refer to men that may live within the area of GFCR Programme
        (e.g. within 100 km) and may experience positive effects or benefits as a result of a
        project or programme, though they may not be the primary target audience. Report as
        cumulative total since the start of the Programme. If there are no indirect beneficiaries
        from GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF7_2_women_helper: () => (
      <>
        Indirect female beneficiaries refer to women that may live within the area of GFCR Programme
        (e.g. within 100 km) and may experience positive effects or benefits as a result of a
        project or programme, though they may not be the primary target audience. Report as
        cumulative total since the start of the Programme. If there are no indirect beneficiaries
        from GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    getF7_2_youth_helper: () => (
      <>
        Indirect young beneficiaries refer to young people (aged between 15-24, as defined by United
        Nations) that may live within the area of GFCR Programme (e.g. within 100 km) and may
        experience positive effects or benefits as a result of a project or programme, though they
        may not be the primary target audience. Report as cumulative total since the start of the
        Programme. If there are no indirect beneficiaries from GFCR Programme, enter &apos;0&apos;.{' '}
        <GfcrPdfLink />
      </>
    ),
    getF7_2_indigenous_helper: () => (
      <>
        Indirect indigenous beneficiaries refer to Indigenous people that may live within the area
        of GFCR Programme (e.g. within 100 km) and may experience positive effects or benefits as a
        result of a project or programme, though they may not be the primary target audience. Report
        as cumulative total since the start of the Programme. If there are no indirect beneficiaries
        from GFCR Programme, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f7_3: 'Number of financial mechanisms/reforms to help coastal communities respond and recover from external shocks',
    getF7_3_helper: () => (
      <>
        Total number of financial mechanisms associated with GFCR Programme that can help coastal
        communities recover from external shocks associated with climate change and other disasters,
        e.g., coral reef insurance programmes, coordinated loan programmes, village savings clubs
        started by the Programme, ecological restoration crisis plans. Report as cumulative total
        since the start of the Programme. If no mechanisms are intended to be supported by the GFCR
        Programme or are not yet in place, enter &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
    f7_4: 'Number of governance reforms/policies to support response and recovery to external shocks',
    getF7_4_helper: () => (
      <>
        Total number of governance reforms/policies connected to national or subnational government
        initiatives and supported by GFCR Programmes, e.g., organizing a policy workshop, providing
        technical input into policy development, crisis management plans, reforms for temporary
        alternative employment. Report as cumulative total since the start of the Programme. If no
        policies are intended to be supported by the GFCR Programme or are not yet in place, enter
        &apos;0&apos;. <GfcrPdfLink />
      </>
    ),
  },
  gfcrIndicatorSetNav: {
    fundIndicatorsHeading: 'FUND INDICATORS',
    reportTitleAndDateHeading: 'Title and date',
    f1: 'Programme area',
    f2: 'Conservation and management',
    f3: 'Restoration',
    f4: 'Coral reef health',
    f5: 'Communities',
    f6: 'People',
    f7: 'Climate response',
    f8F9F10Heading: 'F8, F9, F10',
    financeSolutions: 'Businesses / Finance solutions',
    investments: 'Investments',
    revenues: 'Revenues',
  },
  goToDashboard: 'View on Dashboard',
  gotoExplore: (viewText) => {
    return `View ${viewText} on MERMAID Explore`
  },
}

const navigateAwayPrompt =
  'Are you sure you want to leave this page? You have some unsaved changes.'

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
  const { code, context, fields, name } = validation

  const validationMessages = {
    all_attributes_same_category: () => `All benthic attributes are ${context?.category}`,
    all_equal: () => 'All observations are the same',
    diff_num_images: () => 'Defined number of quadrats does not match count of images uploaded',
    diff_num_quadrats: () =>
      'Defined number of quadrats does not match count of quadrats in observations',
    duplicate_benthic_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_fishbelt_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_collection: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_quadrat_transect: () =>
      getDuplicateSampleUnitLink(context?.duplicate_transect_method, projectId),
    duplicate_transect: () => 'Transect already exists',
    duplicate_values: () =>
      fields?.length
        ? getDuplicateValuesValidationMessage(fields[0], context?.duplicates)
        : 'Duplicate',
    invalid_count: () => getInvalidBleachingObsMessage(context, 'colony count'),
    invalid_percent_value: () => getInvalidBleachingObsMessage(context, 'percent cover'),
    invalid_total: () => getInvalidBleachingObsTotalMessage(context),
    exceed_total_colonies: () => 'Maximum number of colonies exceeded',
    implausibly_old_date: () => 'Sample date is before 1900',
    future_sample_date: () => 'Sample date is in the future',
    high_density: () => `Fish biomass greater than ${context?.biomass_range[1]} kg/ha`,
    incorrect_observation_count: () =>
      `Incorrect number of observations; expected ${context?.expected_count}`,
    invalid_interval_size: () => 'Interval size must be a positive number',
    max_interval_size: () => `Interval size greater than ${context?.interval_size_range[1]} m`,
    max_interval_start: () => `Interval start greater than ${context?.interval_start_range[1]} m`,
    invalid_benthic_transect: () =>
      'One or more invalid fields: site, management, sample date, transect number, width, depth',
    invalid_depth: () => `Depth invalid or not greater than ${context?.depth_range[0]} m`,
    excessive_precision: () =>
      `Depth precision to right of decimal point greater than ${context?.decimal_places} digit(s)`,
    invalid_fish_count: () => 'Fish count must be a non-negative integer',
    invalid_fish_size: () => `Invalid fish size`,
    invalid_fishbelt_transect: () =>
      'One or more invalid fields: site, management, sample date, transect number, width, depth',
    invalid_number_of_points: () =>
      `Total number of points entered for quadrats: ${context?.invalid_quadrat_numbers} does not match defined number of points per quadrat`,
    invalid_quadrat_collection: () =>
      'One or more invalid transect fields: site, management, date, depth',
    invalid_quadrat_size: () => 'Quadrat size must be a positive number',
    max_quadrat_size: () => `Quadrat size greater than ${context?.quadrat_size_range[1]} m2`,
    invalid_quadrat_transect: () =>
      'One or more invalid fields: site, management, sample date, transect number, depth',
    invalid_sample_date: () => 'Invalid date',
    invalid_score: () => `Invalid score`,
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
    not_positive_integer: () => 'Value is not an integer greater or equal to zero',
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
    too_many_observations: () =>
      getObservationsCountMessage(fields, 'Greater', context?.observation_count_range[1]),
    too_few_observations: () =>
      getObservationsCountMessage(fields, 'Fewer', context?.observation_count_range[0]),
    unsuccessful_dry_submit: () => getSystemValidationErrorMessage(context?.dry_submit_results),
    value_not_set: () => 'Value is not set',
    default: () => code || name,
    unconfirmed_annotation: () => 'Wrong number of confirmed annotations',
  }

  return (validationMessages[code] || validationMessages.default)()
}

const helperText = {
  compliance: 'Effectiveness of the rules in the managed area - low compliance to high compliance',
  current: 'Water speed during the survey.',
  depth: 'Depth of sample unit, in meters (e.g. 3).',
  exposure: '',
  fishSizeBin:
    'Name of bin scheme used to estimate fish size for the transect. Choose 1 cm if the fish size recorded does not use bins.',
  intervalSize:
    'Distance between observations on a transect, in meters. May include decimal (e.g. 0.5).',
  intervalStart:
    'Interval counted as the first observation on a transect, in meters. May include decimal (e.g. 0.5).',
  label:
    'Arbitrary text to distinguish sample units that are distinct but should be combined analytically (i.e. all other properties are identical). For example: Long swim. Rarely used.',
  getLatitude: () => (
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
  getLongitude: () => (
    <>
      Longitude in decimal degrees. Should be a number between -180 and 180, representing the
      east-west position on the Earth&apos;s surface. A positive value indicates a location to the
      east of the Prime Meridian, while a negative value indicates a location to the west of the
      Prime Meridian. If you need to convert from degrees-minutes-seconds, an online calculator is{' '}
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
  managementRegimeRules: {
    accessRestrictions:
      'Access is restricted, e.g., people outside a community are not allowed to fish here',
    gearRestrictions: 'Restrictions on what types of fishing gear can be used',
    noTake: 'Total extraction ban',
    openAccess: 'Open for fishing and entering',
    partialRestrictions:
      'e.g. periodic closures, size limits, gear restrictions, species restrictions',
    periodicClosure:
      'The area is open and closed as a fisheries management strategy, e.g., rotating octopus closures',
    sizeLimits: 'Restrictions on the size of certain target species',
    speciesRestrictions: 'Restrictions on what types of species can be caught',
  },
  getManagementRegimeName: () => (
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
  notes: '',
  number:
    'Number is automatically generated by MERMAID as an identifier for a bleaching sample unit, and is not editable.',
  numberOfPointsPerQuadrat: 'Total number of points per quadrat used in a transect (e.g. 100).',
  numberOfQuadrats: 'Total number of quadrats in the transect (e.g. 10).',
  parties: 'Who is responsible for managing this area.',
  quadratSize: 'Quadrat size used per transect, in square meters (e.g. 1).',
  quadratNumberStart: 'Number of the first quadrat/photo along the transect (e.g. 1).',
  getReefSlope: () => (
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
  getReefType: () => (
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
  getReefZone: () => (
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
  getRelativeDepth: () => (
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
  getTide: () => (
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
  admin:
    'User has all Collector privileges, and can additionally change project information and data sharing, add and remove project users, transfer unsubmitted sample units between project users, and un-submit sample units for further editing.',
  getBenthicAttribute: () => (
    <>
      Benthic attribute observed. A benthic attribute can be a taxonomic name for a coral or other
      sessile organism, or an abiotic classification. MERMAID benthic attributes are organized
      hierarchically and are consistent with{' '}
      <HelperTextLink href="https://www.marinespecies.org/" target="_blank" color="#fff">
        WoRMS.
      </HelperTextLink>
    </>
  ),
  collector:
    'User can view, export, and analyze data, and collect new observations. Once a transect is submitted, the user can no longer edit or delete observations.',
  getFishName: () => (
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
  growthForm:
    'Growth form of the observed benthic attribute. Only choose a growth form if it is relevant to the benthic attribute (e.g. Acropora branching).',
  habitatComplexityScore:
    'Benthic complexity score (0 - 5) for transect interval, as integer (e.g. 3). The categories are 0 no vertical reef, flat or rubbly areas; 1 low (<30 cm high) and sparse relief; 2 low but widespread relief; 3 widespread moderately complex (30-60 cm high) relief; 4 widespread very complex (60 -100 cm high) relief with numerous fissures and caves; 5 exceptionally complex (>1 m high) relief with numerous caves and overhangs).',
  hardCoralPercentage: 'Hard coral cover as decimal percentage of quadrat total area (e.g. 33.3).',
  macroalgaePercentage: 'Macroalgae cover as decimal percentage of quadrat total area (e.g. 33.3).',
  numberOfPoints:
    'Number of points with unique benthic attribute (/growth form) for the quadrat. The sum of points for all benthic attributes in a quadrat must equal the value set above.',
  quadrat: 'Number of quadrat/photo in transect (e.g. 1).',
  readOnly:
    'User can only view, export, and analyze data in the analysis tools, but cannot collect new observations.',
  softCoralPercentage: 'Soft coral cover as decimal percentage of quadrat total area (e.g. 33.3).',
}

export default {
  apiDataTableNames,
  autocomplete,
  buttons,
  createNewOptionModal,
  gfcrFinanceSolutionModal,
  gfcrInvestmentModal,
  gfcrRevenueModal,
  gfcrNewIndicatorSetModal,
  deleteProject,
  deleteRecord,
  error,
  getResolveModalLanguage,
  getValidationMessage,
  header,
  helperText,
  inlineMessage,
  loadingIndicator,
  map,
  navigateAwayPrompt,
  pages,
  placeholders,
  popoverTexts,
  protocolTitles,
  success,
  table,
  title,
  tooltipText,
}

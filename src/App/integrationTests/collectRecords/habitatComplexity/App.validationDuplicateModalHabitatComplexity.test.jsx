import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import App from '../../../App'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockSampleEventValidationObject from '../../../../testUtilities/mockCollectRecords/mockSampleEventValidationObject'
import mockHabitatComplexityCollectRecords from '../../../../testUtilities/mockCollectRecords/mockHabitatComplexityCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const validateCollectRecord = async (user) => {
  const validateButton = await screen.findByTestId('validate-button', { timeout: 10000 })
  await user.click(validateButton)

  // Button should transition to validating state
  expect(await screen.findByTestId('validating-button'))
  // Then back to validate state
  await waitFor(() => expect(screen.getByTestId('validate-button')))
}

test('Validate Habitat Complexity collect record, get site duplicate warning, show resolve button, keep original site, and merge duplicate site to original site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.not_unique_site'),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('site')).findByTestId('resolve-site-button')
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-site-modal')
  const originalSite = await within(resolveModal).findByTestId('resolve-duplicate-original-site')
  const keepOriginalSiteButton = await within(originalSite).findByTestId(
    'resolve-duplicate-keep-original-site',
  )

  await user.click(keepOriginalSiteButton)

  const confirmationModal = await screen.findByTestId('resolve-duplicate-confirmation-modal')

  expect(
    await within(confirmationModal).findByTestId('resolve-duplicate-confirmation-message'),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByTestId('resolve-duplicate-merge')

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-site-modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('validation_messages.not_unique_site'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Habitat Complexity collect record, get site duplicate warning, show resolve button, keep duplicate site, and merge original site to duplicate site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.not_unique_site'),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('site')).findByTestId('resolve-site-button')
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-site-modal')
  const duplicateSite = await within(resolveModal).findByTestId('resolve-duplicate-duplicate-site')
  const keepDuplicateSiteButton = await within(duplicateSite).findByTestId(
    'resolve-duplicate-keep-duplicate-site',
  )

  await user.click(keepDuplicateSiteButton)

  const confirmationModal = await screen.findByTestId('resolve-duplicate-confirmation-modal')

  expect(
    await within(confirmationModal).findByTestId('resolve-duplicate-confirmation-message'),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByTestId('resolve-duplicate-merge')

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-site-modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('validation_messages.not_unique_site'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Habitat Complexity collect record, get site duplicate warning, show resolve button, edit original site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.not_unique_site'),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('site')).findByTestId('resolve-site-button')
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-site-modal')
  const originalSite = await within(resolveModal).findByTestId('resolve-duplicate-original-site')
  const editOriginalSiteButton = await within(originalSite).findByTestId(
    'resolve-duplicate-edit-original-site',
  )

  await user.click(editOriginalSiteButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const siteCPage = await screen.findByText('Site C', {
    selector: 'h2',
  })

  expect(siteCPage).toBeInTheDocument()
}, 50000)

test('Validate Habitat Complexity collect record, get site duplicate warning, show resolve button, edit duplicate site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.not_unique_site'),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('site')).findByTestId('resolve-site-button')
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-site-modal')
  const duplicateSite = await within(resolveModal).findByTestId('resolve-duplicate-duplicate-site')
  const editDuplicateSiteButton = await within(duplicateSite).findByTestId(
    'resolve-duplicate-edit-duplicate-site',
  )

  await user.click(editDuplicateSiteButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const siteCPage = await screen.findByText('Site D', {
    selector: 'h2',
  })

  expect(siteCPage).toBeInTheDocument()
}, 50000)

test('Validate Habitat Complexity collect record, get site duplicate warning, show resolve button, keep both sites', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('validation_messages.not_unique_site'),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('site')).findByTestId('resolve-site-button')
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-site-modal')
  const keepBothSiteButton = await within(resolveModal).findByTestId('resolve-duplicate-keep-both')

  await user.click(keepBothSiteButton)

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByTestId('input-validation-warning'),
    ).not.toBeInTheDocument(),
  )

  const ignoredSiteValidation = await within(screen.getByTestId('site')).findByTestId(
    'message-pill-ignore',
  )

  expect(ignoredSiteValidation).toBeInTheDocument()
})

test('Validate Habitat Complexity collect record, get management similar name warning, show resolve button, keep original management, and merge duplicate management to original management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'validation_messages.similar_name',
    ),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('management')).findByTestId(
    'resolve-management-button',
  )
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-management-modal')
  const originalManagement = await within(resolveModal).findByTestId(
    'resolve-duplicate-management-original',
  )
  const keepOriginalManagementButton = await within(originalManagement).findByTestId(
    'resolve-duplicate-management-keep-original',
  )

  await user.click(keepOriginalManagementButton)

  const confirmationModal = await screen.findByTestId(
    'resolve-duplicate-management-confirmation-modal',
  )

  expect(
    await within(confirmationModal).findByTestId(
      'resolve-duplicate-management-confirmation-message',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByTestId(
    'resolve-duplicate-management-confirm-merge',
  )

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-management-modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText(
        'validation_messages.similar_name',
      ),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Habitat Complexity collect record, get management similar name warning, show resolve button, keep duplicate management, and merge original management to duplicate management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'validation_messages.similar_name',
    ),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('management')).findByTestId(
    'resolve-management-button',
  )
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-management-modal')
  const duplicateManagement = await within(resolveModal).findByTestId(
    'resolve-duplicate-management-duplicate',
  )
  const keepDuplicateManagementButton = await within(duplicateManagement).findByTestId(
    'resolve-duplicate-management-keep-duplicate',
  )

  await user.click(keepDuplicateManagementButton)

  const confirmationModal = await screen.findByTestId(
    'resolve-duplicate-management-confirmation-modal',
  )

  expect(
    await within(confirmationModal).findByTestId(
      'resolve-duplicate-management-confirmation-message',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByTestId(
    'resolve-duplicate-management-confirm-merge',
  )

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('resolve-duplicate-management-modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText(
        'validation_messages.similar_name',
      ),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Habitat Complexity collect record, get management duplicate warning, show resolve button, edit original management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'validation_messages.similar_name',
    ),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('management')).findByTestId(
    'resolve-management-button',
  )
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-management-modal')
  const originalManagement = await within(resolveModal).findByTestId(
    'resolve-duplicate-management-original',
  )
  const editOriginalManagementButton = await within(originalManagement).findByTestId(
    'resolve-duplicate-management-edit-original',
  )

  await user.click(editOriginalManagementButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const managementRegimeCPage = await screen.findByText('Management Regimes C', {
    selector: 'h2',
  })

  expect(managementRegimeCPage).toBeInTheDocument()
}, 50000)

test('Validate Habitat Complexity collect record, get management duplicate warning, show resolve button, edit duplicate management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'validation_messages.similar_name',
    ),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('management')).findByTestId(
    'resolve-management-button',
  )
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-management-modal')
  const duplicateManagement = await within(resolveModal).findByTestId(
    'resolve-duplicate-management-duplicate',
  )
  const editDuplicateManagementButton = await within(duplicateManagement).findByTestId(
    'resolve-duplicate-management-edit-duplicate',
  )

  await user.click(editDuplicateManagementButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const managementRegimeAPage = await screen.findByText('Management Regimes A', {
    selector: 'h2',
  })

  expect(managementRegimeAPage).toBeInTheDocument()
}, 50000)

test('Validate Habitat Complexity collect record, get management duplicate warning, show resolve button, keep both managements', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockHabitatComplexityCollectRecords[0],
        validations: mockSampleEventValidationObject,
      }

      const response = {
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [collectRecordWithValidation] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }

      return HttpResponse.json(response)
    }),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'validation_messages.similar_name',
    ),
  ).toBeInTheDocument()

  const resolveButton = await within(screen.getByTestId('management')).findByTestId(
    'resolve-management-button',
  )
  await user.click(resolveButton)

  const resolveModal = await screen.findByTestId('resolve-duplicate-management-modal')
  const keepBothManagementRegimeButton = await within(resolveModal).findByTestId(
    'resolve-duplicate-management-keep-both',
  )

  await user.click(keepBothManagementRegimeButton)

  await waitFor(() =>
    expect(
      within(screen.getByTestId('management')).queryByTestId('input-validation-warning'),
    ).not.toBeInTheDocument(),
  )

  const ignoredManagementValidation = await within(screen.getByTestId('management')).findByTestId(
    'message-pill-ignore',
  )

  expect(ignoredManagementValidation).toBeInTheDocument()
})

import { expect, test } from "vitest";
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
import mockBleachingCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBleachingCollectRecords'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const validateCollectRecord = async (user) => {
  const validateButton = await screen.findByTestId('validate-button', { timeout: 10000 })
  await user.click(validateButton)

  // Button should transition to validating state
  expect(await screen.findByTestId('validating-button'))
  // Then back to validate state
  await waitFor(() => expect(screen.getByTestId('validate-button')))
}

test('Validate Bleaching collect record, get site duplicate warning, show resolve button, keep original site, and merge duplicate site to original site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  await user.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByLabelText('Resolve Duplicate Site Modal')
  const originalSite = await within(resolveModal).findByLabelText('Original Site')
  const keepOriginalSiteButton = await within(originalSite).findByRole('button', {
    name: 'Keep site',
  })

  await user.click(keepOriginalSiteButton)

  const confirmationModal = screen.getByLabelText('Confirm Merge Site Modal')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with original site',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Resolve Duplicate Site Modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Bleaching collect record, get site duplicate warning, show resolve button, keep duplicate site, and merge original site to duplicate site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  await user.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByLabelText('Resolve Duplicate Site Modal')
  const duplicateSite = await within(resolveModal).findByLabelText('Duplicate Site')
  const keepDuplicateSiteButton = await within(duplicateSite).findByRole('button', {
    name: 'Keep site',
  })

  await user.click(keepDuplicateSiteButton, { id: '4' })

  const confirmationModal = screen.getByLabelText('Confirm Merge Site Modal')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with duplicate site',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() => screen.queryByLabelText('Resolve Duplicate Site Modal'))

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText('Site: Similar records detected'),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Bleaching collect record, get site duplicate warning, show resolve button, edit original site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  await user.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByLabelText('Resolve Duplicate Site Modal')
  const originalSite = await within(resolveModal).findByLabelText('Original Site')
  const editOriginalSiteButton = await within(originalSite).findByRole('button', {
    name: 'Edit site',
  })

  await user.click(editOriginalSiteButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const siteCPage = await screen.findByText('Site C', {
    selector: 'h2',
  })

  expect(siteCPage).toBeInTheDocument()
}, 50000)

test('Validate Bleaching collect record, get site duplicate warning, show resolve button, edit duplicate site', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  await user.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByLabelText('Resolve Duplicate Site Modal')
  const duplicateSite = await within(resolveModal).findByLabelText('Duplicate Site')
  const editDuplicateSiteButton = await within(duplicateSite).findByRole('button', {
    name: 'Edit site',
  })

  await user.click(editDuplicateSiteButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const siteCPage = await screen.findByText('Site D', {
    selector: 'h2',
  })

  expect(siteCPage).toBeInTheDocument()
}, 50000)

test('Validate Bleaching collect record, get site duplicate warning, show resolve button, keep both sites', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('site')).getByText('Site: Similar records detected'),
  ).toBeInTheDocument()

  await user.click(within(screen.getByTestId('site')).getByRole('button', { name: 'Resolve' }))

  const resolveModal = screen.getByLabelText('Resolve Duplicate Site Modal')
  const keepBothSiteButton = await within(resolveModal).findByRole('button', { name: 'Keep both' })

  await user.click(keepBothSiteButton)

  await waitFor(() =>
    expect(within(screen.getByTestId('site')).queryByText('warning')).not.toBeInTheDocument(),
  )

  expect(within(screen.getByTestId('site')).getByText('ignored')).toBeInTheDocument()
})

test('Validate Bleaching collect record, get management similar name warning, show resolve button, keep original management, and merge duplicate management to original management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'Another Management Regime is similar to this one.',
    ),
  ).toBeInTheDocument()

  await user.click(
    within(screen.getByTestId('management')).getByRole('button', { name: 'Resolve' }),
  )

  const resolveModal = screen.getByLabelText('Resolve Duplicate Management Modal')
  const originalManagement = await within(resolveModal).findByLabelText('Original Management')
  const keepOriginalManagementButton = await within(originalManagement).findByRole('button', {
    name: 'Keep MR',
  })

  await user.click(keepOriginalManagementButton)

  const confirmationModal = screen.getByLabelText('Confirm Merge Management Modal')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with original mr',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('Resolve Duplicate Management Modal'),
  )

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText(
        'Another Management Regime is similar to this one.',
      ),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Bleaching collect record, get management similar name warning, show resolve button, keep duplicate management, and merge original management to duplicate management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'Another Management Regime is similar to this one.',
    ),
  ).toBeInTheDocument()

  await user.click(
    within(screen.getByTestId('management')).getByRole('button', { name: 'Resolve' }),
  )

  const resolveModal = screen.getByLabelText('Resolve Duplicate Management Modal')
  const duplicateManagement = await within(resolveModal).findByLabelText('Duplicate Management')
  const keepDuplicateManagementButton = await within(duplicateManagement).findByRole('button', {
    name: 'Keep MR',
  })

  await user.click(keepDuplicateManagementButton)

  const confirmationModal = screen.getByLabelText('Confirm Merge Management Modal')

  expect(
    await within(confirmationModal).findByText(
      'All instances of this site will be replaced with duplicate mr',
    ),
  ).toBeInTheDocument()

  const mergeButton = await within(confirmationModal).findByRole('button', { name: 'Merge' })

  await user.click(mergeButton)

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('Resolve Duplicate Management Modal'),
  )

  await waitFor(() =>
    expect(
      within(screen.getByTestId('site')).queryByText(
        'Another Management Regime is similar to this one.',
      ),
    ).not.toBeInTheDocument(),
  )
}, 50000)

test('Validate Bleaching collect record, get management duplicate warning, show resolve button, edit original management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'Another Management Regime is similar to this one.',
    ),
  ).toBeInTheDocument()

  await user.click(
    within(screen.getByTestId('management')).getByRole('button', { name: 'Resolve' }),
  )

  const resolveModal = screen.getByLabelText('Resolve Duplicate Management Modal')
  const originalManagement = await within(resolveModal).findByLabelText('Original Management')
  const editOriginalManagementButton = await within(originalManagement).findByRole('button', {
    name: 'Edit MR',
  })

  await user.click(editOriginalManagementButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const managementRegimeCPage = await screen.findByText('Management Regimes C', {
    selector: 'h2',
  })

  expect(managementRegimeCPage).toBeInTheDocument()
}, 50000)

test('Validate Bleaching collect record, get management duplicate warning, show resolve button, edit duplicate management', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'Another Management Regime is similar to this one.',
    ),
  ).toBeInTheDocument()

  await user.click(
    within(screen.getByTestId('management')).getByRole('button', { name: 'Resolve' }),
  )

  const resolveModal = screen.getByLabelText('Resolve Duplicate Management Modal')
  const duplicateManagement = await within(resolveModal).findByLabelText('Duplicate Management')
  const editDuplicateManagementButton = await within(duplicateManagement).findByRole('button', {
    name: 'Edit MR',
  })

  await user.click(editDuplicateManagementButton)

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  const managementRegimeAPage = await screen.findByText('Management Regimes A', {
    selector: 'h2',
  })

  expect(managementRegimeAPage).toBeInTheDocument()
}, 50000)

test('Validate Bleaching collect record, get management duplicate warning, show resolve button, keep both managements', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      return HttpResponse.json({}, { status: 200 })
    }),

    http.post(`${apiBaseUrl}/pull/`, () => {
      const collectRecordWithValidation = {
        ...mockBleachingCollectRecords[0],
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
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await validateCollectRecord(user)

  expect(
    within(screen.getByTestId('management')).getByText(
      'Another Management Regime is similar to this one.',
    ),
  ).toBeInTheDocument()

  await user.click(
    within(screen.getByTestId('management')).getByRole('button', { name: 'Resolve' }),
  )

  const resolveModal = screen.getByLabelText('Resolve Duplicate Management Modal')
  const keepBothManagementRegimeButton = await within(resolveModal).findByRole('button', {
    name: 'Keep both',
  })

  await user.click(keepBothManagementRegimeButton)

  await waitFor(() =>
    expect(within(screen.getByTestId('management')).queryByText('warning')).not.toBeInTheDocument(),
  )

  expect(within(screen.getByTestId('management')).getByText('ignored')).toBeInTheDocument()
})

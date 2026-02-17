import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import mockMermaidData from './mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const mockMermaidApiAllSuccessful = setupServer(
  http.get(`${apiBaseUrl}/me`, () => {
    return HttpResponse.json({
      id: 'fake-id',
      first_name: 'W-FakeFirstNameOnline', // W is to differentiate online user icon initials from offline initials
      last_name: 'W-FakeLastNameOnline', // W is to differentiate online user icon initials from offline initials
      full_name: 'W-FakeFirstNameOnline W-FakeLastNameOnline',
    })
  }),
  http.get(`${apiBaseUrl}/health/`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.get(`${apiBaseUrl}/notifications`, () => {
    return HttpResponse.json('a string')
  }),
  http.post(`${apiBaseUrl}/push/`, async ({ request }) => {
    const body = await request.json()
    const reqCollectRecords = body.collect_records ?? []
    const reqSites = body.project_sites ?? []
    const reqProjectManagements = body.project_managements ?? []
    const collectRecordsWithStatusCodes = reqCollectRecords.map((record) => ({
      data: { ...record, _last_revision_num: 1000 },
      status_code: 200,
    }))
    const sitesWithStatusCodes = reqSites.map((site) => ({
      data: { ...site, _last_revision_num: 1000 },
      status_code: 200,
    }))
    const projectManagementsWithStatusCode = reqProjectManagements.map((management) => ({
      data: { ...management, _last_revision_num: 1000 },
      status_code: 200,
    }))

    const response = {
      collect_records: collectRecordsWithStatusCodes,
      project_sites: sitesWithStatusCodes,
      project_managements: projectManagementsWithStatusCode,
    }

    return HttpResponse.json(response)
  }),

  http.get(`${apiBaseUrl}/projects/`, () => {
    return HttpResponse.json(mockMermaidData.projectsEndpoint)
  }),

  http.post(`${apiBaseUrl}/pull/`, () => {
    const response = {
      benthic_attributes: {
        updates: mockMermaidData.benthic_attributes,
        last_revision_num: 'initial',
      },
      choices: { updates: mockMermaidData.choices, last_revision_num: 'initial' },
      collect_records: { updates: mockMermaidData.collect_records, last_revision_num: 'initial' },
      fish_families: { updates: mockMermaidData.fish_families, last_revision_num: 'initial' },
      fish_genera: { updates: mockMermaidData.fish_genera, last_revision_num: 'initial' },
      fish_species: { updates: mockMermaidData.fish_species, last_revision_num: 'initial' },
      project_managements: {
        updates: mockMermaidData.project_managements,
        last_revision_num: 'initial',
      },
      project_profiles: {
        updates: mockMermaidData.project_profiles,
        last_revision_num: 'initial',
      },
      project_sites: { updates: mockMermaidData.project_sites, last_revision_num: 'initial' },
      projects: { updates: mockMermaidData.projects, last_revision_num: 'initial' },
    }

    return HttpResponse.json(response)
  }),

  http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.get(`${apiBaseUrl}/projects/5/summary/`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.get(`${apiBaseUrl}/sites/`, () => {
    return HttpResponse.json(mockMermaidData.sitesEndpoint)
  }),
  http.get(`${apiBaseUrl}/managementRegimes/`, () => {
    return HttpResponse.json(mockMermaidData.managementRegimesEndpoint)
  }),
  http.put(`${apiBaseUrl}/projects/5/find_and_replace_sites`, () => {
    const response = {
      num_collect_records_updated: 3,
      num_sample_events_updated: 2,
      num_sites_removed: 1,
    }

    return HttpResponse.json(response)
  }),
  http.put(`${apiBaseUrl}/projects/5/find_and_replace_managements`, () => {
    const response = {
      num_collect_records_updated: 3,
      num_sample_events_updated: 2,
      num_managements_removed: 1,
    }

    return HttpResponse.json(response)
  }),
)

export default mockMermaidApiAllSuccessful

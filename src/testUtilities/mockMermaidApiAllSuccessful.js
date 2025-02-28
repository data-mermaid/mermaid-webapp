import { rest } from 'msw'
import { setupServer } from 'msw/node'
import mockMermaidData from './mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

const mockMermaidApiAllSuccessful = setupServer(
  rest.get(`${apiBaseUrl}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'W-FakeFirstNameOnline', // W is to differentiate online user icon initials from offline initials
        last_name: 'W-FakeLastNameOnline', // W is to differentiate online user icon initials from offline initials
        full_name: 'W-FakeFirstNameOnline W-FakeLastNameOnline',
      }),
    )
  }),
  rest.get(`${apiBaseUrl}/health`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/notifications`, (req, res, ctx) => {
    return res(
      // TODO: Including an object here breaks findByTestId('page-size-selector') in tests
      // ctx.json({
      //   ...mockMermaidData.notifications,
      // }),
      // A string allows the tests to pass but is not useful for writing tests for bell notifications
      ctx.json('a string'),
    )
    // Returning status allows tests to pass but there an error is thrown from getBellNotifications because apiResults.data is undefined
    // return res(ctx.status(200))
  }),
  rest.post(`${apiBaseUrl}/push/`, (req, res, ctx) => {
    const reqCollectRecords = req.body.collect_records ?? []
    const reqSites = req.body.project_sites ?? []
    const reqProjectManagements = req.body.project_managements ?? []
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

    return res(ctx.json(response))
  }),

  rest.get(`${apiBaseUrl}/projects/`, (req, res, ctx) => {
    const response = {
      ...mockMermaidData.projectsEndpoint,
    }

    return res(ctx.json(response))
  }),

  rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
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

    return res(ctx.json(response))
  }),

  rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/5/summary/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/sites/`, (req, res, ctx) => {
    const response = {
      ...mockMermaidData.sitesEndpoint,
    }

    return res(ctx.json(response))
  }),
  rest.get(`${apiBaseUrl}/managementRegimes/`, (req, res, ctx) => {
    const response = {
      ...mockMermaidData.managementRegimesEndpoint,
    }

    return res(ctx.json(response))
  }),
  rest.put(`${apiBaseUrl}/projects/5/find_and_replace_sites`, (req, res, ctx) => {
    const response = {
      num_collect_records_updated: 3,
      num_sample_events_updated: 2,
      num_sites_removed: 1,
    }

    return res(ctx.json(response))
  }),
  rest.put(`${apiBaseUrl}/projects/5/find_and_replace_managements`, (req, res, ctx) => {
    const response = {
      num_collect_records_updated: 3,
      num_sample_events_updated: 2,
      num_managements_removed: 1,
    }

    return res(ctx.json(response))
  }),
)

mockMermaidApiAllSuccessful.listen({
  onUnhandledRequest: 'warn',
})

export default mockMermaidApiAllSuccessful

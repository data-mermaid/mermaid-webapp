import { rest } from 'msw'
import { setupServer } from 'msw/node'
import mockMermaidData from './mockMermaidData'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

const mockMermaidApiAllSuccessful = setupServer(
  rest.get(`${apiBaseUrl}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'FakeFirstNameOnline',
        last_name: 'FakeLastNameOnline',
        full_name: 'FakeFirstNameOnline FakeLastNameOnline',
      }),
    )
  }),
  rest.get(`${apiBaseUrl}/health`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post(`${apiBaseUrl}/push/`, (req, res, ctx) => {
    const reqCollectRecords = req.body.collect_records ?? []
    const reqSites = req.body.project_sites ?? []
    const collectRecordsWithStatusCodes = reqCollectRecords.map((record) => ({
      data: { ...record, _last_revision_num: 1000 },
      status_code: 200,
    }))
    const sitesWithStatusCodes = reqSites.map((site) => ({
      data: { ...site, _last_revision_num: 1000 },
      status_code: 200,
    }))

    const response = {
      collect_records: collectRecordsWithStatusCodes,
      project_sites: sitesWithStatusCodes,
    }

    return res(ctx.json(response))
  }),

  rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
    const response = {
      benthic_attributes: { updates: mockMermaidData.benthic_attributes },
      choices: { updates: mockMermaidData.choices },
      collect_records: { updates: mockMermaidData.collect_records },
      fish_families: { updates: mockMermaidData.fish_families },
      fish_genera: { updates: mockMermaidData.fish_genera },
      fish_species: { updates: mockMermaidData.fish_species },
      project_managements: { updates: mockMermaidData.project_managements },
      project_profiles: { updates: mockMermaidData.project_profiles },
      project_sites: { updates: mockMermaidData.project_sites },
      projects: { updates: mockMermaidData.projects },
    }

    return res(ctx.json(response))
  }),

  rest.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post(`${apiBaseUrl}/projects/5/collectrecords/submit/`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/5/sampleunitmethods`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/1/project_profiles`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/2/project_profiles`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/3/project_profiles`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/4/project_profiles`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(`${apiBaseUrl}/projects/5/project_profiles`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
)

mockMermaidApiAllSuccessful.listen({
  onUnhandledRequest: 'warn',
})

export default mockMermaidApiAllSuccessful

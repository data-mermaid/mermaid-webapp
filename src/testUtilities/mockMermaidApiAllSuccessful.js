import { rest } from 'msw'
import { setupServer } from 'msw/node'
import mockMermaidData from './mockMermaidData'

const mockMermaidApiAllSuccessful = setupServer(
  rest.get(`${process.env.REACT_APP_MERMAID_API}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'FakeFirstNameOnline',
        last_name: 'FakeLastNameOnline',
        full_name: 'FakeFirstNameOnline FakeLastNameOnline',
      }),
    )
  }),
  rest.post(`${process.env.REACT_APP_MERMAID_API}/push/`, (req, res, ctx) => {
    const collectRecordsWithStatusCodes = req.body.collect_records.map(
      (record) => ({
        ...record,
        status_code: 200,
        _last_revision_num: 1000,
      }),
    )

    const response = { collect_records: collectRecordsWithStatusCodes }

    return res(ctx.json(response))
  }),

  rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
    const response = {
      benthic_attributes: { updates: mockMermaidData.benthic_attributes },
      fish_families: { updates: mockMermaidData.fishFamilies },
      fish_genera: { updates: mockMermaidData.fishGenera },
      fish_species: { updates: mockMermaidData.fishSpecies },
      choices: { updates: mockMermaidData.choices },
      projects: { updates: mockMermaidData.projects },
    }

    return res(ctx.json(response))
  }),
)

mockMermaidApiAllSuccessful.listen({
  onUnhandledRequest: 'warn',
})

export default mockMermaidApiAllSuccessful

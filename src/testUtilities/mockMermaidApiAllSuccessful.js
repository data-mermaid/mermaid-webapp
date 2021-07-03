import { rest } from 'msw'
import { setupServer } from 'msw/node'

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
)

mockMermaidApiAllSuccessful.listen({
  onUnhandledRequest: 'warn',
})

export default mockMermaidApiAllSuccessful

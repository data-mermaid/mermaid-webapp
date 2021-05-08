import { rest } from 'msw'
import { setupServer } from 'msw/node'

const mockMermaidApiAllSuccessful = setupServer(
  rest.get(`${process.env.REACT_APP_MERMAID_API}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'FakeFirstNameOnline',
      }),
    )
  }),
  rest.post(`${process.env.REACT_APP_MERMAID_API}/push/`, (req, res, ctx) => {
    return res(ctx.json(req.body))
  }),
)

mockMermaidApiAllSuccessful.listen({
  onUnhandledRequest: 'warn',
})

export default mockMermaidApiAllSuccessful

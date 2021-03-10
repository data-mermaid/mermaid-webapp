import { rest } from 'msw'
import { setupServer } from 'msw/node'

const mockMermaidApiAllSuccessful = setupServer(
  rest.get(`${process.env.REACT_APP_MERMAID_API}/me`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'fake-id',
        first_name: 'FakeFirstNameOnline',
        last_name: 'FakeLastName',
        full_name: 'FakeFirstName FakeLastName',
        email: 'fake@email.com',
        created_on: '2020-10-16T15:27:30.555961Z',
        updated_on: '2020-10-16T15:27:30.569938Z',
      }),
    )
  }),
)

export default mockMermaidApiAllSuccessful

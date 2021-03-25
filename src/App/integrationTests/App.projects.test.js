import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { getMockMermaidDbAccessInstance } from '../../testUtilities/mockMermaidDbAccess'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

// remove testing comments here before merging or next pr please

test('Clicking anywhere on a project card navigates to the project collect page when offline', async () => {
  renderAuthenticatedOffline(
    <App mermaidDbAccessInstance={getMockMermaidDbAccessInstance()} />,
  )

  // the root level app doesnt have a loading indicator yet, so well test for the page name
  // otherwise testing that the indicator has disappeared progresses the test before the actual projects view has loaded

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  // trying to avoid using getByTestId leads us to make the application have
  // better accessibility by making the dev realize a list wasnt using good html semantics
  // that said there could be other lists on the screen which will make this test fail without more specificity
  // Im not sure how to solve that problem while avoiding a testId, so well leave it for now.
  // ... i tried though
  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Collect Records', {
      selector: 'h3',
    }),
  )
})

test('Clicking anywhere on a project card navigates to the project health page when online', async () => {
  renderAuthenticatedOnline(
    <App mermaidDbAccessInstance={getMockMermaidDbAccessInstance()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(projectCard)

  expect(
    await screen.findByText('Project Health', {
      selector: 'h3',
    }),
  )
})

// this next test would pass regardless even if it should fail, im not sure why.
// Probably because we are explicitly  clicking the actual button, not the area
// above the button ???
// so we wont test for that (not ideal)

// test('Clicking on the copy button on a project card does not cause navigation', async () => {
//   renderAuthenticatedOnline(
//     <App mermaidDbAccessInstance={getMockMermaidDbAccessInstance()} />,
//   )

//   expect(
//     await screen.findByText('Projects', {
//       selector: 'h1',
//     }),
//   )

//   const projectCard = screen.getAllByRole('listitem')[0]

//   within(projectCard).getByText('Copy')

//   expect(
//     await screen.findByText('Projects', {
//       selector: 'h1',
//     }),
//   )
// })

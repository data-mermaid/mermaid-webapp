import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import App from '../App'
import { mock500StatusCodeForAllDataTypesPush } from '../../testUtilities/mockPushStatusCodes'

test('Push sync status code of 500 shows toasts on project-related page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        return res(ctx.json(mock500StatusCodeForAllDataTypesPush))
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  expect(await screen.findByText('MERMAID sync error: please contact support@datamermaid.org'))
})

test('Push sync status code of 500 shows toasts on project list page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      (req, res, ctx) => {
        return res(ctx.json(mock500StatusCodeForAllDataTypesPush))
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('projects list loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('projects list loading indicator'))

  expect(await screen.findByText('MERMAID sync error: please contact support@datamermaid.org'))
})

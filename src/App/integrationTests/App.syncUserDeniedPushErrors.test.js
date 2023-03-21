import '@testing-library/jest-dom/extend-expect'
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
import { mockUserDoesntHavePushSyncPermissionForProjects } from '../../testUtilities/mockPushStatusCodes'

test('User being denied push sync shows toasts', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (req, res, ctx) => {
        return res(ctx.json(mockUserDoesntHavePushSyncPermissionForProjects))
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('projects list loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('projects list loading indicator'))

  const project100ToastContent = await screen.findByTestId('sync-error-for-project-100')
  const project500ToastContent = await screen.findByTestId('sync-error-for-project-500')
  const project900ToastContent = await screen.findByTestId('sync-error-for-project-900')

  expect(project100ToastContent).toHaveTextContent(
    'You do not have permission to sync data to Project 100. Please check your notifications and consult with a project administrator about your project role.',
  )
  expect(project100ToastContent).toHaveTextContent("The following haven't been saved: ")
  expect(project100ToastContent).toHaveTextContent('benthic attributes')
  expect(project100ToastContent).toHaveTextContent('unsubmitted sample units')
  expect(project100ToastContent).toHaveTextContent('fish species')
  expect(project100ToastContent).toHaveTextContent('management regimes')
  expect(project100ToastContent).toHaveTextContent('project users')
  expect(project100ToastContent).toHaveTextContent('sites')
  expect(project100ToastContent).toHaveTextContent('project info')

  expect(project500ToastContent).toHaveTextContent(
    'You do not have permission to sync data to Project 500. Please check your notifications and consult with a project administrator about your project role.',
  )
  expect(project500ToastContent).toHaveTextContent("The following haven't been saved: ")
  expect(project500ToastContent).not.toHaveTextContent('benthic attributes')
  expect(project500ToastContent).not.toHaveTextContent('unsubmitted sample units')
  expect(project500ToastContent).not.toHaveTextContent('fish species')
  expect(project500ToastContent).toHaveTextContent('management regimes')
  expect(project500ToastContent).not.toHaveTextContent('project users')
  expect(project500ToastContent).toHaveTextContent('sites')
  expect(project500ToastContent).not.toHaveTextContent('project info')

  expect(project900ToastContent).toHaveTextContent(
    'You do not have permission to sync data to Project 900. Please check your notifications and consult with a project administrator about your project role.',
  )
  expect(project900ToastContent).toHaveTextContent("The following haven't been saved: ")
  expect(project900ToastContent).not.toHaveTextContent('benthic attributes')
  expect(project900ToastContent).toHaveTextContent('unsubmitted sample units')
  expect(project900ToastContent).not.toHaveTextContent('fish species')
  expect(project900ToastContent).toHaveTextContent('management regimes')
  expect(project900ToastContent).toHaveTextContent('project users')
  expect(project900ToastContent).not.toHaveTextContent('sites')
  expect(project900ToastContent).toHaveTextContent('project info')
})

import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import App from '../App'
import { mockUserDoesntHavePushSyncPermissionForProjects } from '../../testUtilities/mockPushStatusCodes'

test('User being denied push sync shows toasts on project-related page', async () => {
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
    initialEntries: ['/projects/5/collecting'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const project100ToastContent = await screen.findByTestId('sync-error-for-project-100')
  const project500ToastContent = await screen.findByTestId('sync-error-for-project-500')
  const project900ToastContent = await screen.findByTestId('sync-error-for-project-900')

  expect(project100ToastContent).toHaveTextContent(
    'You do not have permission to sync data to Project 100. Please check your notifications and consult with a project administrator about your project role.',
  )
  expect(project100ToastContent).toHaveTextContent('Unsaved data:')
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
  expect(project500ToastContent).toHaveTextContent('Unsaved data:')
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
  expect(project900ToastContent).toHaveTextContent('Unsaved data:')
  expect(project900ToastContent).not.toHaveTextContent('benthic attributes')
  expect(project900ToastContent).toHaveTextContent('unsubmitted sample units')
  expect(project900ToastContent).not.toHaveTextContent('fish species')
  expect(project900ToastContent).toHaveTextContent('management regimes')
  expect(project900ToastContent).toHaveTextContent('project users')
  expect(project900ToastContent).not.toHaveTextContent('sites')
  expect(project900ToastContent).toHaveTextContent('project info')
})

test('User being denied push sync toast doesnt show duplicate unsaved data types', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const mockSyncErrorDataWithDuplicateUnsavedDataInfo = {
    benthic_attributes: [
      {
        status_code: 403,
        message: 'You do not have permission to perform this action.',
        data: {
          project_id: '100',
          project_name: 'Project 100',
        },
      },
      {
        status_code: 403,
        message: 'You do not have permission to perform this action.',
        data: {
          project_id: '100',
          project_name: 'Project 100',
        },
      },
    ],
  }

  mockMermaidApiAllSuccessful.use(
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/push/`,

      (req, res, ctx) => {
        return res(ctx.json(mockSyncErrorDataWithDuplicateUnsavedDataInfo))
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
    initialEntries: ['/projects/5/collecting'],
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const project100ToastContent = await screen.findByTestId('sync-error-for-project-100')

  expect(within(project100ToastContent).getAllByText('benthic attributes').length).toEqual(1)
})

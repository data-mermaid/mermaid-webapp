import { expect, test } from "vitest";
import '@testing-library/jest-dom'
import { http, HttpResponse } from 'msw'
import React from 'react'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import App from '../App'
import { mockUserDoesntHavePushSyncPermissionForProjects } from '../../testUtilities/mockPushStatusCodes'

test('User being denied push sync shows toasts on project-related page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      () => {
        return HttpResponse.json(mockUserDoesntHavePushSyncPermissionForProjects)
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const project5ToastContent = await screen.findByTestId('sync-error-for-project-5')
  const project500ToastContent = screen.queryByTestId('sync-error-for-project-500')
  const project900ToastContent = screen.queryByTestId('sync-error-for-project-900')

  expect(project5ToastContent).toHaveTextContent(
    'You do not have permission to sync data to Project 5. Please check your notifications and consult with a project administrator about your project role.',
  )
  expect(project5ToastContent).toHaveTextContent('benthic attributes')
  expect(project5ToastContent).toHaveTextContent('unsubmitted sample units')
  expect(project5ToastContent).toHaveTextContent('fish species')
  expect(project5ToastContent).toHaveTextContent('management regimes')
  expect(project5ToastContent).toHaveTextContent('project users')
  expect(project5ToastContent).toHaveTextContent('sites')
  expect(project5ToastContent).toHaveTextContent('project info')

  await waitFor(() => expect(project500ToastContent).not.toBeInTheDocument())
  await waitFor(() => expect(project900ToastContent).not.toBeInTheDocument())
})

test('User being denied push sync toast doesnt show duplicate unsaved data types', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const mockSyncErrorDataWithDuplicateUnsavedDataInfo = {
    benthic_attributes: [
      {
        status_code: 403,
        message: 'You do not have permission to perform this action.',
        data: {
          project_id: '5',
          project_name: 'Project 5',
        },
      },
      {
        status_code: 403,
        message: 'You do not have permission to perform this action.',
        data: {
          project_id: '5',
          project_name: 'Project 5',
        },
      },
    ],
  }

  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/push/`,

      () => {
        return HttpResponse.json(mockSyncErrorDataWithDuplicateUnsavedDataInfo)
      },
    ),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
    initialEntries: ['/projects/5/collecting'],
  })

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const project5ToastContent = await screen.findByTestId('sync-error-for-project-5')

  expect(within(project5ToastContent).getAllByText('benthic attributes').length).toEqual(1)
})

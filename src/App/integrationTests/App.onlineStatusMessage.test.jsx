import { expect, test, vi } from "vitest";
import '@testing-library/jest-dom'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticated,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

test('Appropriate online status message shows when navigator is online', async () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)

  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('status-online')).toBeInTheDocument()
  expect(screen.queryByTestId('status-offline')).not.toBeInTheDocument()
})
test('Appropriate online status message shows when navigator is offline', async () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  expect(screen.queryByTestId('status-online')).not.toBeInTheDocument()
  expect(await screen.findByTestId('status-offline')).toBeInTheDocument()
})

test('Appropriate online status message shows when server is reachable', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  expect(await screen.findByTestId('status-online')).toBeInTheDocument()
  expect(screen.queryByTestId('status-offline')).not.toBeInTheDocument()
})
test('Appropriate online status message shows when server is unreachable', async () => {
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/health`, () => {
      return HttpResponse.error()
    }),
  )
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })
  // timeout is necessary here because the server ping happens every 5 seconds.

  expect(await screen.findByTestId('status-offline')).toBeInTheDocument()
  expect(screen.queryByTestId('status-online')).not.toBeInTheDocument()
})

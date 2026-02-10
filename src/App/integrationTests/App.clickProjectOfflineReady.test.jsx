import { beforeEach, describe, expect, test } from 'vitest'
import '@testing-library/jest-dom'

import { http, HttpResponse } from 'msw'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

/**  this is a very imperative test suite in that its testing state (indexeddb),
 * but since sync is integral to the app, and since we do not have the
 * features fully consuming the synced state yet to test against,
 * we are making an exception. Testing is a push was part of the
 * sync was skipped as it might be a convoluted test and not great ROI
 */
beforeEach(() => {
  /** in order to test the different types of sync,
   * we want to simulate the api in that it only returns
   * the data that was requested, unlike the default
   * mock api which returns ALL the mocks. This mock is
   * now in the territory of tightly coupling tests passing/failing
   * with mock implementation details. We isolate this to this test suite to isolate the risk.
   * */
  mockMermaidApiAllSuccessful.use(
    http.post(
      `${import.meta.env.VITE_MERMAID_API}/pull/`,

      async ({ request }) => {
        const requestedDataNames = Object.keys(await request.json())

        const onlyRequestedItems = requestedDataNames.reduce(
          (accumulator, dataName) => ({
            ...accumulator,
            [dataName]: { updates: mockMermaidData[dataName] },
          }),
          {},
        )

        return HttpResponse.json(onlyRequestedItems)
      },
    ),
  )
})

describe('Offline integration tests', () => {
  test('Sync: select project to be offline ready, shows toast, syncs and stores data, shows project as selected', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )
    /**
     * api syncing can cause the loading indicator to initially be absent,
     * and then show up. for the test to work, we need to wait for
     * the loading indicator to show first before we wait for it to disappear
     */

    await screen.findByTestId('projects-loading-indicator')
    await waitForElementToBeRemoved(() => screen.queryByTestId('projects-loading-indicator'))

    expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(0)
    expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(0)
    expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(0)
    expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(0)

    const projectOfflineCheckboxBeforeFirstClick = within(
      (await screen.findAllByTestId('project-card'))[4],
    ).getByTestId('offline-ready')

    await user.click(projectOfflineCheckboxBeforeFirstClick)

    expect(await screen.findByText("Project Z has an apostrophe foo's is now offline ready"))

    const projectOfflineCheckboxAfterProjectSetOffline = within(
      (await screen.findAllByTestId('project-card'))[4],
    ).getByTestId('offline-ready')

    await waitFor(() => expect(projectOfflineCheckboxAfterProjectSetOffline).toBeChecked())

    expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(22)
    expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(
      mockMermaidData.project_managements.length,
    )
    expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(
      mockMermaidData.project_profiles.length,
    )
    expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(
      mockMermaidData.project_sites.length,
    )
  })
  test('Sync: select project to NOT be offline ready, shows toast, removes data, shows project as not selected', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    const projectOfflineCheckboxBeforeFirstClick = within(
      (await screen.findAllByTestId('project-card'))[5],
    ).getByTestId('offline-ready')

    //check offline ready
    await user.click(projectOfflineCheckboxBeforeFirstClick)
    expect(await screen.findByText('Project III is now offline ready'))
    const projectOfflineCheckboxAfterFirstClick = within(
      (await screen.findAllByTestId('project-card'))[5],
    ).getByTestId('offline-ready')
    await waitFor(() => expect(projectOfflineCheckboxAfterFirstClick).toBeChecked())

    //uncheck
    await user.click(projectOfflineCheckboxAfterFirstClick)
    await waitFor(() => expect(screen.getByText('Project III is now offline ready')))

    const project5 = within((await screen.findAllByTestId('project-card'))[4])
    const project5OfflineCheckbox = project5.getByTestId('offline-ready')
    expect(project5OfflineCheckbox).not.toBeChecked()

    expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(
      mockMermaidData.collect_records.filter((record) => record.project !== '6').length,
    )
    expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(
      mockMermaidData.project_managements.filter(
        (managementRegime) => managementRegime.project !== '6',
      ).length,
    )
    expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(
      mockMermaidData.project_profiles.filter((profile) => profile.project !== '6').length,
    )
    expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(
      mockMermaidData.project_sites.filter((site) => site.project !== '6').length,
    )
  })
})

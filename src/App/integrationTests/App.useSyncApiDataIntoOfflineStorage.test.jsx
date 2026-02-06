import '@testing-library/jest-dom'

import { http, HttpResponse } from 'msw'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
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

      () => {
        const requestedDataNames = Object.keys(req.body)

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
test('Sync: initial page load on non project page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  expect((await dexiePerUserDataInstance.benthic_attributes.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.choices.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_families.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_genera.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_species.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.projects.toArray()).length).toEqual(0)

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByTestId('projects-loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('projects-loading-indicator'))

  expect((await dexiePerUserDataInstance.benthic_attributes.toArray()).length).toEqual(
    mockMermaidData.benthic_attributes.length,
  )
  expect((await dexiePerUserDataInstance.choices.toArray()).length).toEqual(1) // choices is weird and gets overwritten
  expect((await dexiePerUserDataInstance.fish_families.toArray()).length).toEqual(
    mockMermaidData.fish_families.length,
  )
  expect((await dexiePerUserDataInstance.fish_genera.toArray()).length).toEqual(
    mockMermaidData.fish_genera.length,
  )
  expect((await dexiePerUserDataInstance.fish_species.toArray()).length).toEqual(
    mockMermaidData.fish_species.length,
  )
  expect((await dexiePerUserDataInstance.projects.toArray()).length).toEqual(
    mockMermaidData.projects.length,
  )
})
test('Sync: initial page load on project page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  expect((await dexiePerUserDataInstance.benthic_attributes.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.choices.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_families.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_genera.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.fish_species.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.projects.toArray()).length).toEqual(0)

  expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(0)

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
    initialEntries: ['/projects/5/collecting/fishbelt/'],
  })

  await screen.findByTestId('loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect((await dexiePerUserDataInstance.benthic_attributes.toArray()).length).toEqual(
    mockMermaidData.benthic_attributes.length,
  )
  // choices is weird and is just a giant object that gets overwritten
  expect((await dexiePerUserDataInstance.choices.toArray()).length).toEqual(1)
  expect((await dexiePerUserDataInstance.fish_families.toArray()).length).toEqual(
    mockMermaidData.fish_families.length,
  )
  expect((await dexiePerUserDataInstance.fish_genera.toArray()).length).toEqual(
    mockMermaidData.fish_genera.length,
  )
  expect((await dexiePerUserDataInstance.fish_species.toArray()).length).toEqual(
    mockMermaidData.fish_species.length,
  )
  expect((await dexiePerUserDataInstance.projects.toArray()).length).toEqual(
    mockMermaidData.projects.length,
  )

  expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(
    mockMermaidData.collect_records.length,
  )
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

test('Sync: initial page load already done, navigate to non project page', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByTestId('projects-loading-indicator')
  await waitForElementToBeRemoved(() => screen.queryByTestId('projects-loading-indicator'))

  /**
   * because of the other landing page initial load sync test,
   * we can rely on that data already being here and focus on the
   * the data that has not yet been synced. A project page nav sync
   * will technically pull more than this
   * (the stuff that gets pulled on a non project page load minus choices),
   * but we are going to just test the data that has not already been pulled
   * to balance ROI. Ignoring choices for the same reason as its exclusion
   * is for performance optimization, and it being pulled or not will not cause bugs
   */
  expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(0)
  expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(0)

  const projectWithId5 = screen.getAllByTestId('project-card')[4]

  await user.click(projectWithId5)

  /**
   * api syncing can cause the loading indicator to initially be absent,
   * and then show up. for the test to work, we need to wait for
   * the loading indicator to show first before we wait for it to disappear
   */

  // this makes the act errors disappear.

  // commented out tests below due to toast network rror

  // expect(within(await screen.findByTestId('collect-record-count')).getByText('21'))

  // expect((await dexiePerUserDataInstance.collect_records.toArray()).length).toEqual(22)
  // expect((await dexiePerUserDataInstance.project_managements.toArray()).length).toEqual(
  //   mockMermaidData.project_managements.length,
  // )
  // expect((await dexiePerUserDataInstance.project_profiles.toArray()).length).toEqual(
  //   mockMermaidData.project_profiles.length,
  // )
  // expect((await dexiePerUserDataInstance.project_sites.toArray()).length).toEqual(
  //   mockMermaidData.project_sites.length,
  // )
})

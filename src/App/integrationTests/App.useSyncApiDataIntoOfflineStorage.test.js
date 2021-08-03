import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import React from 'react'

import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'

/**  this is a very imperative test suite in that its testing state (indexeddb),
 * but since sync is integral to the app, and since we don't have the
 * features fully consuming the synced state yet to test against,
 * we are making an exception
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
    rest.post(
      `${process.env.REACT_APP_MERMAID_API}/pull/`,

      (req, res, ctx) => {
        const requestedDataNames = Object.keys(req.body)

        const onlyRequestedItems = requestedDataNames.reduce(
          (accumulator, dataName) => ({
            ...accumulator,
            [dataName]: { updates: mockMermaidData[dataName] },
          }),
          {},
        )

        return res(ctx.json(onlyRequestedItems))
      },
    ),
  )
})
test('Sync: initial page load on non project page', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  expect((await dexieInstance.benthic_attributes.toArray()).length).toEqual(0)
  expect((await dexieInstance.choices.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_families.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_genera.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_species.toArray()).length).toEqual(0)
  expect((await dexieInstance.projects.toArray()).length).toEqual(0)

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    dexieInstance,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  expect((await dexieInstance.benthic_attributes.toArray()).length).toEqual(
    mockMermaidData.benthic_attributes.length,
  )
  expect((await dexieInstance.choices.toArray()).length).toEqual(1) // choices is weird and gets overwritten
  expect((await dexieInstance.fish_families.toArray()).length).toEqual(
    mockMermaidData.fish_families.length,
  )
  expect((await dexieInstance.fish_genera.toArray()).length).toEqual(
    mockMermaidData.fish_genera.length,
  )
  expect((await dexieInstance.fish_species.toArray()).length).toEqual(
    mockMermaidData.fish_species.length,
  )
  expect((await dexieInstance.projects.toArray()).length).toEqual(
    mockMermaidData.projects.length,
  )
})
test('Sync: initial page load on project page', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  expect((await dexieInstance.benthic_attributes.toArray()).length).toEqual(0)
  expect((await dexieInstance.choices.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_families.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_genera.toArray()).length).toEqual(0)
  expect((await dexieInstance.fish_species.toArray()).length).toEqual(0)
  expect((await dexieInstance.projects.toArray()).length).toEqual(0)

  expect((await dexieInstance.collect_records.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_managements.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_profiles.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_sites.toArray()).length).toEqual(0)

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    dexieInstance,
    initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )
  expect((await dexieInstance.benthic_attributes.toArray()).length).toEqual(
    mockMermaidData.benthic_attributes.length,
  )
  // choices is weird and is just a giant object that gets overwritten
  expect((await dexieInstance.choices.toArray()).length).toEqual(1)
  expect((await dexieInstance.fish_families.toArray()).length).toEqual(
    mockMermaidData.fish_families.length,
  )
  expect((await dexieInstance.fish_genera.toArray()).length).toEqual(
    mockMermaidData.fish_genera.length,
  )
  expect((await dexieInstance.fish_species.toArray()).length).toEqual(
    mockMermaidData.fish_species.length,
  )
  expect((await dexieInstance.projects.toArray()).length).toEqual(
    mockMermaidData.projects.length,
  )

  expect((await dexieInstance.collect_records.toArray()).length).toEqual(
    mockMermaidData.collect_records.length,
  )
  expect((await dexieInstance.project_managements.toArray()).length).toEqual(
    mockMermaidData.project_managements.length,
  )
  expect((await dexieInstance.project_profiles.toArray()).length).toEqual(
    mockMermaidData.project_profiles.length,
  )
  expect((await dexieInstance.project_sites.toArray()).length).toEqual(
    mockMermaidData.project_sites.length,
  )
})
// immediately upcoming ticket to create loader for syncing due to navigation (M310).
// Cant test nav syncs until user has indication that sync is done via loading
// indicator disappearing (otherwise there is race condition in test)

test('Sync: initial page load already done, navigate to non project page', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
    dexieInstance,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('loading indicator'),
  )

  /**
   because of the other landing page initial load sync test,
   we can rely on that data already being here and focus on the
   the data that hasn't yet been synced. A project page nav sync
   will technically pull more than this
   (the stuff that gets pulled on a non project page load minus choices),
   but we are going to just test the data that hasn't already been pulled
    to balance ROI. Ignoring choices for the same reason as its exclusion
    is for performance optimization, and it being pulled or not will not cause bugs
   */
  expect((await dexieInstance.collect_records.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_managements.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_profiles.toArray()).length).toEqual(0)
  expect((await dexieInstance.project_sites.toArray()).length).toEqual(0)

  const firstProjectListed = screen.getAllByRole('listitem')[0]

  userEvent.click(firstProjectListed)

  // await waitForElementToBeRemoved(() =>
  //   screen.queryByLabelText('loading indicator'),
  // )

  // expect((await dexieInstance.collect_records.toArray()).length).toEqual(
  //   mockMermaidData.collect_records.length,
  // )
  // expect((await dexieInstance.project_managements.toArray()).length).toEqual(
  //   mockMermaidData.project_managements.length,
  // )
  // expect((await dexieInstance.project_profiles.toArray()).length).toEqual(
  //   mockMermaidData.project_profiles.length,
  // )
  // expect((await dexieInstance.project_sites.toArray()).length).toEqual(
  //   mockMermaidData.project_sites.length,
  // )
})

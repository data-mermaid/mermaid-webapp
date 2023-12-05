import '@testing-library/jest-dom'
import { rest } from 'msw'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
  mockMermaidApiAllSuccessful,
  waitForElementToBeRemoved,
} from '../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'
import App from '../App'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

test(`When a sync pull responds with removes arrays, 
the items in the removes array are deleted from browser storage`, async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  // hydrate dexie with fake data to be removed

  const benthicAttributesHydrationPromise = dexiePerUserDataInstance.benthic_attributes.add({
    id: 'myCatIsCute',
  })

  const fishFamiliesHydrationPromise = dexiePerUserDataInstance.fish_families.add({
    id: 'myCatIsCute',
  })
  const fishGeneraHydrationPromise = dexiePerUserDataInstance.fish_genera.add({ id: 'myCatIsCute' })
  const fishSpeciesHydrationPromise = dexiePerUserDataInstance.fish_species.add({
    id: 'myCatIsCute',
  })
  const collectRecordsHydrationPromise = dexiePerUserDataInstance.collect_records.add({
    id: 'myCatIsCute',
  })

  const projectManagementsHydrationPromise = dexiePerUserDataInstance.project_managements.add({
    id: 'myCatIsCute',
  })

  const projectProfilesHydrationPromise = dexiePerUserDataInstance.project_profiles.add({
    id: 'myCatIsCute',
  })

  const projectSitesHydrationPromise = dexiePerUserDataInstance.project_sites.add({
    id: 'myCatIsCute',
  })

  const hydrationResponse = await Promise.all([
    benthicAttributesHydrationPromise,
    collectRecordsHydrationPromise,
    fishFamiliesHydrationPromise,
    fishGeneraHydrationPromise,
    fishSpeciesHydrationPromise,
    projectManagementsHydrationPromise,
    projectProfilesHydrationPromise,
    projectSitesHydrationPromise,
  ])

  const didFakeDataHydrateSuccessfully =
    hydrationResponse.filter((tableResponse) => tableResponse === 'myCatIsCute').length === 8

  expect(didFakeDataHydrateSuccessfully).toBeTruthy()

  const _mockedApiWithRemovesArrayItemsForPullRequest = mockMermaidApiAllSuccessful.use(
    rest.post(`${apiBaseUrl}/pull/`, (req, res, ctx) => {
      const responseWithSyncErrors = {
        choices: {
          // choices is weird. There will be no removes
        },
        fish_species: {
          removes: [{ id: 'myCatIsCute' }],
        },
        fish_genera: {
          removes: [{ id: 'myCatIsCute' }],
        },
        fish_families: {
          removes: [{ id: 'myCatIsCute' }],
        },
        benthic_attributes: {
          removes: [{ id: 'myCatIsCute' }],
        },
        collect_records: {
          removes: [{ id: 'myCatIsCute' }],
        },
        project_managements: {
          removes: [{ id: 'myCatIsCute' }],
        },
        project_profiles: {
          removes: [{ id: 'myCatIsCute' }],
        },
        project_sites: {
          removes: [{ id: 'myCatIsCute' }],
        },
      }

      return res.once(ctx.json(responseWithSyncErrors))
    }),
  )

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
    initialEntries: ['/projects/5/collecting/'],
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const benthicAttributesAfterRemoves = await dexiePerUserDataInstance.benthic_attributes.get(
    'myCatIsCute',
  )

  expect(benthicAttributesAfterRemoves).toBeUndefined()

  expect(await dexiePerUserDataInstance.fish_families.get('myCatIsCute')).toBeUndefined()
  expect(await dexiePerUserDataInstance.fish_genera.get('myCatIsCute')).toBeUndefined()
  expect(await dexiePerUserDataInstance.fish_species.get('myCatIsCute')).toBeUndefined()
  expect(await dexiePerUserDataInstance.collect_records.get('myCatIsCute')).toBeUndefined()
  expect(await dexiePerUserDataInstance.project_managements.get('1')).toBeUndefined()
  expect(await dexiePerUserDataInstance.project_profiles.get('myCatIsCute')).toBeUndefined()
  expect(await dexiePerUserDataInstance.project_sites.get('myCatIsCute')).toBeUndefined()
})

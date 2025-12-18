import '@testing-library/jest-dom'

import React from 'react'

import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstancesAllSuccess } from '../../testUtilities/mockDexie'

test('Clicking Add Sample Unit then click Fish Belt link expects to see New Fish Belt page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  await user.click(screen.getByTestId('add-sample-unit-button'))
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('fishbelt-link'))

  const newFishBeltTitle = await screen.findByTestId('fishbelt-page-title')

  expect(newFishBeltTitle).toBeInTheDocument()
})

test('Clicking Add Sample Unit then click Benthic Pit link expects to see New Benthic PIT page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  await user.click(screen.getByTestId('add-sample-unit-button'))
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('benthicpit-link'))

  const newBenthicPitTitle = await screen.findByTestId('benthicpit-page-title')

  expect(newBenthicPitTitle).toBeInTheDocument()
})

test('Clicking Add Sample Unit then click Habitat Complexity link expects to see New Habitat Complexity page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  await user.click(screen.getByTestId('add-sample-unit-button'))
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('habitatcomplexity-link'))

  const newHabitatComplexityTitle = await screen.findByTestId('habitatcomplexity-page-title')

  expect(newHabitatComplexityTitle).toBeInTheDocument()
})

test('Clicking Add Sample Unit then click Benthic LIT link expects to see New Benthic LIT page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  await user.click(screen.getByTestId('add-sample-unit-button'))
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('benthiclit-link'))

  const newBenthicLITTitle = await screen.findByTestId('benthiclit-page-title')

  expect(newBenthicLITTitle).toBeInTheDocument()
})

test('Clicking Add Sample Unit then click Bleaching link expects to see New Bleaching page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  await user.click(screen.getByTestId('add-sample-unit-button'))
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('bleachingqc-link'))

  const newBleachingTitle = await screen.findByTestId('bleachingqc-page-title')

  expect(newBleachingTitle).toBeInTheDocument()
})

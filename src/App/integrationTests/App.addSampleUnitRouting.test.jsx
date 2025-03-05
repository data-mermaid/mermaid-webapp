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

  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: /fish belt/i,
    }),
  )

  const newFishBeltTitle = await screen.findByText('Fish Belt', {
    selector: 'h2',
  })

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

  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Benthic PIT',
    }),
  )

  const newBenthicPitTitle = await screen.findByText('Benthic PIT', {
    selector: 'h2',
  })

  expect(newBenthicPitTitle)
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

  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Habitat Complexity',
    }),
  )

  const newHabitatComplexityTitle = await screen.findByText('Habitat Complexity', {
    selector: 'h2',
  })

  expect(newHabitatComplexityTitle)
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

  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Benthic LIT',
    }),
  )

  const newBenthicLITTitle = await screen.findByText('Benthic LIT', {
    selector: 'h2',
  })

  expect(newBenthicLITTitle)
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

  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Bleaching',
    }),
  )

  const newBleachingTitle = await screen.findByText('Bleaching', {
    selector: 'h2',
  })

  expect(newBleachingTitle)
})

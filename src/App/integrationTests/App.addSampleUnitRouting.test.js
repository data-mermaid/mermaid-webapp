import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
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

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: /fish belt/i,
    }),
  )

  const newFishBeltTitle = await screen.findByText('Fish Belt', {
    selector: 'h2',
  })

  expect(newFishBeltTitle).toBeInTheDocument()
})

test('Clicking Add Sample Unit then click Benthic PIT link expects to see New Benthic PIT page.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  await screen.findByLabelText('project pages loading indicator')
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Benthic PIT',
    }),
  )

  const newBenthicPITTitle = await screen.findByText('Benthic PIT', {
    selector: 'h2',
  })

  expect(newBenthicPITTitle)
})

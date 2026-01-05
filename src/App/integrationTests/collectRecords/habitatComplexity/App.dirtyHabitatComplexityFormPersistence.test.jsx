import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  renderAuthenticatedOnline,
  within,
  renderAuthenticated,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

test('Unsaved NEW Habitat Complexity form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  expect(within(form).getByTestId('depth-input')).not.toHaveValue()

  // enter a depth
  await user.type(await within(form).findByTestId('depth-input'), '45')

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)

  // nav away
  const sideNav = await screen.findByTestId('content-page-side-nav')

  await user.click(within(sideNav).getByRole('link', { name: /collecting/i }))
  // nav back
  await user.click(await screen.findByTestId('add-sample-unit-button'))
  const sampleUnitNav = await screen.findByTestId('new-sample-unit-nav')

  await user.click(within(sampleUnitNav).getByTestId('habitatcomplexity-link'))

  await waitFor(async () =>
    expect(within(await screen.findByRole('form')).getByTestId('depth-input')).not.toHaveValue(),
  )
})

test('Unsaved EDIT Habitat Complexity form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByTestId('depth-input')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByTestId('depth-input')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)

  // nav away
  const sideNav = screen.getByTestId('content-page-side-nav')

  await user.click(within(sideNav).getByRole('link', { name: /collecting/i }))

  // nav back
  const table = await screen.findByRole('table')

  await user.click(within(table).getAllByText('Habitat Complexity')[0])

  // initial unedited depth value
  await waitFor(async () =>
    expect(within(await screen.findByRole('form')).getByTestId('depth-input')).toHaveValue(20),
  )
})
test('Unsaved NEW Habitat Complexity form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  expect(within(form).getByTestId('depth-input')).not.toHaveValue()

  // enter a depth
  const depthInput = await within(form).findByTestId('depth-input')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)
  expect(screen.getByTestId('save-button')).toBeEnabled()

  await user.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)
  expect(await screen.findByTestId('save-button')).toBeEnabled()
})

test('Unsaved EDIT Habitat Complexity form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/habitatcomplexity/80'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByTestId('depth-input')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByTestId('depth-input')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)
  expect(screen.getByTestId('save-button')).toBeEnabled()

  await user.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByTestId('depth-input')).toHaveValue(45)
  expect(await screen.findByTestId('save-button')).toBeEnabled()
})

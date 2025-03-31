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

test('Unsaved NEW bleaching form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText('Depth')).not.toHaveValue()

  // enter a depth
  await user.type(await within(form).findByLabelText('Depth'), '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)

  // nav away
  const sideNav = await screen.findByTestId('content-page-side-nav')

  await user.click(within(sideNav).getByRole('link', { name: /collecting/i }))
  // nav back
  await user.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = await screen.findByTestId('new-sample-unit-nav')

  await user.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Bleaching',
    }),
  )

  const formAfterNav = await screen.findByRole('form')

  await waitFor(() => expect(within(formAfterNav).getByLabelText('Depth')).not.toHaveValue())
})

test('Unsaved EDIT bleaching form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText('Depth')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)

  // nav away
  const sideNav = screen.getByTestId('content-page-side-nav')

  await user.click(within(sideNav).getByRole('link', { name: /collecting/i }))

  // nav back
  const table = await screen.findByRole('table')

  await user.click(
    within(table).getAllByRole('link', {
      name: 'Bleaching',
    })[0],
  )

  const formAfterNav = await screen.findByRole('form')

  // initial unedited depth value
  await waitFor(() => expect(within(formAfterNav).getByLabelText('Depth')).toHaveValue(20))
})
test('Unsaved NEW bleaching form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText('Depth')).not.toHaveValue()

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()

  await user.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

test('Unsaved EDIT bleaching form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticated(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/bleachingqc/60'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText('Depth')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  await user.clear(depthInput)
  await user.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()

  await user.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

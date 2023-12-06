import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOnline,
  within,
  renderAuthenticated,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'

test('Unsaved NEW benthic pit form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText('Depth')).not.toHaveValue()

  // enter a depth
  userEvent.type(await within(form).findByLabelText('Depth'), '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)

  // nav away
  const sideNav = await screen.findByTestId('content-page-side-nav')

  userEvent.click(within(sideNav).getByRole('link', { name: /collecting/i }))
  // nav back
  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = await screen.findByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: 'Benthic PIT',
    }),
  )

  const formAfterNav = await screen.findByRole('form')

  waitFor(() => expect(within(formAfterNav).getByLabelText('Depth')).not.toHaveValue())
})

test('Unsaved EDIT benthic pit form edits clear when the user navigates away and back', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText('Depth')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  userEvent.clear(depthInput)
  userEvent.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)

  // nav away
  const sideNav = screen.getByTestId('content-page-side-nav')

  userEvent.click(within(sideNav).getByRole('link', { name: /collecting/i }))

  // nav back
  const table = await screen.findByRole('table')

  userEvent.click(
    within(table).getAllByRole('link', {
      name: 'Benthic PIT',
    })[0],
  )

  const formAfterNav = await screen.findByRole('form')

  // initial unedited depth value
  waitFor(() => expect(within(formAfterNav).getByLabelText('Depth')).toHaveValue(20))
})
test('Unsaved NEW benthic pit form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText('Depth')).not.toHaveValue()

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  userEvent.clear(depthInput)
  userEvent.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()

  userEvent.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

test('Unsaved EDIT benthic pit form edits persist through change in online/offline status', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticated(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
    initialEntries: ['/projects/5/collecting/benthicpit/50'],
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  })

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText('Depth')).toHaveValue(20)

  // enter a depth
  const depthInput = await within(form).findByLabelText('Depth')

  userEvent.clear(depthInput)
  userEvent.type(depthInput, '45')

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()

  userEvent.click(screen.getByTestId('offline-toggle-switch-label'))

  expect(await within(form).findByLabelText('Depth')).toHaveValue(45)
  expect(await screen.findByRole('button', { name: 'Save' })).toBeEnabled()
})

import '@testing-library/jest-dom'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import App from '../../App'

test.skip('(TODO - TEST TECH DEBT) Observers input shows users that have been removed from the project and allows for them to be deleted from the collect record.', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  const observersRow = await screen.findByTestId('observers')

  await waitFor(() =>
    expect(within(observersRow).getByTestId('removed-observer-warning')).toBeInTheDocument(),
  )

  await user.click(await within(observersRow).findByTestId('remove-observer-button'))

  const modal = await screen.findByRole('dialog', { timeout: 5000 })
  fireEvent.click(within(modal).getByTestId('remove-observer-confirm-button'))

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

  fireEvent.click(screen.getByRole('button', { name: 'Save' }))

  expect(await screen.findByText('Record saved.'))

  // TODO: Verify observer removal is properly implemented
  // await waitFor(() =>
  //   expect(within(observersRow).queryByTestId('removed-observer-warning')).not.toBeInTheDocument(),
  // )
})

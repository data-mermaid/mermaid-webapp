import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { renderAuthenticatedOnline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import { BellNotificationProvider } from '../../App/BellNotificationContext'
import BellNotificationDropDown from './BellNotificationDropDown'

const renderDropDown = (notifications: object[]) =>
  renderAuthenticatedOnline(
    <BellNotificationProvider
      value={{ notifications, deleteNotification: () => {}, deleteAllNotifications: () => {} }}
    >
      <BellNotificationDropDown />
    </BellNotificationProvider>,
  )

const getNotification = (title: string, status: string, created_on: string) => ({
  id: title,
  title,
  status,
  created_on,
})

test('Releases sit under Updates, above the rest grouped error, warning, info, newest first', () => {
  renderDropDown([
    getNotification('Old info', 'info', '2026-01-01T00:00:00Z'),
    getNotification('Warning', 'warning', '2026-01-02T00:00:00Z'),
    getNotification('Old release', 'release', '2026-01-03T00:00:00Z'),
    getNotification('New info', 'info', '2026-01-04T00:00:00Z'),
    getNotification('Error', 'error', '2026-01-05T00:00:00Z'),
    getNotification('New release', 'release', '2026-01-06T00:00:00Z'),
  ])

  const headingsAndTitles = screen
    .getAllByText(/^(updates_heading|notifications_heading|.*(info|Warning|Error|release))$/)
    .map((element) => element.textContent)

  expect(headingsAndTitles).toEqual([
    'updates_heading',
    'New release',
    'Old release',
    'notifications_heading',
    'Error',
    'Warning',
    'New info',
    'Old info',
  ])
})

test('Dismissing a release has its own analytics id', () => {
  renderDropDown([
    getNotification('Release', 'release', '2026-01-02T00:00:00Z'),
    getNotification('Info', 'info', '2026-01-01T00:00:00Z'),
  ])

  const buttonIds = screen.getAllByRole('button').map((button) => button.id)

  expect(buttonIds).toEqual([
    'gtm-dismiss-all-notifications',
    'gtm-dismiss-one-release',
    'gtm-dismiss-one-notification',
  ])
})

test('A group with no notifications has no heading', () => {
  renderDropDown([getNotification('Info', 'info', '2026-01-01T00:00:00Z')])

  expect(screen.queryByRole('heading', { name: 'updates_heading' })).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'notifications_heading' })).toBeInTheDocument()
})

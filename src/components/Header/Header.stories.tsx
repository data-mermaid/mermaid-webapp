import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { BellNotificationProvider } from '../../App/BellNotificationContext'
import { CurrentUserProvider } from '../../App/CurrentUserContext'
import { OnlineStatusProvider } from '../../library/onlineStatusContext'
import Header from '.'

const currentUser = {
  id: '1',
  first_name: 'Ada',
  last_name: 'Lovelace',
  full_name: 'Ada Lovelace',
  email: 'ada@example.com',
}

const withProviders =
  (online: boolean, notifications: unknown[] = []) =>
  (Story: React.ComponentType) =>
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(
        OnlineStatusProvider,
        { value: { isAppOnline: online } },
        React.createElement(
          BellNotificationProvider,
          { value: { notifications } },
          React.createElement(
            CurrentUserProvider,
            { value: currentUser },
            React.createElement(Story),
          ),
        ),
      ),
    )

const meta = {
  component: Header,
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedIn: Story = {
  decorators: [withProviders(true)],
  args: { currentUser, logout: () => {} },
}

export const LoggedInWithNotifications: Story = {
  decorators: [withProviders(true, [{ id: '1' }])],
  args: { currentUser, logout: () => {} },
}

export const Offline: Story = {
  decorators: [withProviders(false)],
  args: { currentUser, logout: () => {} },
}

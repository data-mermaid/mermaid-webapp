import React from 'react'
import type { Preview } from '@storybook/react'
import { StyledEngineProvider } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  // Global decorators that wrap ALL stories - essential for your app context
  decorators: [
    (Story) =>
      React.createElement(
        StyledEngineProvider,
        { injectFirst: true }, // Ensures MUI styles have priority
        React.createElement(
          I18nextProvider,
          { i18n }, // Provides translation context to all stories
          React.createElement(Story),
        ),
      ),
  ],
}

export default preview

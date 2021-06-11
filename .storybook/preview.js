import { Auth0Context } from '@auth0/auth0-react'
import { MemoryRouter } from 'react-router-dom'
import { OnlineStatusProvider } from '../src/library/onlineStatusContext'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '../src/library/styling/globalStyles'
import theme from '../src/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
  (Story) => (
    <Auth0Context.Provider
      value={{
        isAuthenticated: true,
        user: { name: 'Fake Auth0 User' },
        logout: () => {},
        getAccessTokenSilently: () => Promise.resolve('fake-token'),
      }}
    >
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <OnlineStatusProvider value={{ isOnline: true }}>
            <GlobalStyle />
            <Story />
          </OnlineStatusProvider>
        </ThemeProvider>
      </MemoryRouter>
    </Auth0Context.Provider>
  ),
]

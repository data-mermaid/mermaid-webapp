import type { StorybookConfig } from '@storybook/react-vite'

const isVitestRun =
  process.env.VITEST === 'true' || process.env.NODE_ENV === 'test' || process.env.CI === 'true'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    ...(!isVitestRun ? ['@chromatic-com/storybook'] : []),
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-vite',
}
export default config

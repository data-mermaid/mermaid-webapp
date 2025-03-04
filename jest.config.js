module.exports = {
  restoreMocks: true,
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@iconify-icons|@reach|@fontsource|uuid|dexie)/.*)', // ignore transforming node_modules except for the libraries inside the inner brackets
  ],
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-svg-transformer',
    '^.+\\.(css|less|scss|png)$': 'identity-obj-proxy',
    '@fontsource/open-sans': 'identity-obj-proxy',
    'react-toastify/dist/ReactToastify.css': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
}

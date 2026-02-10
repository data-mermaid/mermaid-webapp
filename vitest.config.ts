import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'
import type { Plugin } from 'vite'

/**
 * Vite plugin that stubs CSS/style and static asset imports in tests.
 * Unlike Jest's moduleNameMapper (which accepts regexes), Vite's alias system
 * only matches literal strings/prefixes. This plugin intercepts imports at the
 * resolve step so Vite never tries to find the actual files.
 */
function stubAssetImports(): Plugin {
  const styleRE = /\.(css|less|scss|sass|styl|stylus|pcss|postcss)($|\?)/
  const assetRE = /\.(png|jpe?g|gif|webp|bmp|svg|ico|woff2?|eot|ttf|otf)($|\?)/

  return {
    name: 'vitest-stub-assets',
    enforce: 'pre',
    resolveId(source) {
      if (styleRE.test(source)) {
        return '\0stub:css'
      }
      if (assetRE.test(source)) {
        return '\0stub:asset'
      }
      if (source === '@fontsource/open-sans') {
        return '\0stub:css'
      }
    },
    load(id) {
      if (id === '\0stub:css') {
        return 'export default {}'
      }
      if (id === '\0stub:asset') {
        return 'export default "test-file-stub"'
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), stubAssetImports()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [
      // dotenv/config in Jest → here we can load env via vite, but to emulate Jest:
      'dotenv/config',
      'src/setupTests.js',
    ],
    // Replace jest.setTimeout with a per-project default:
    testTimeout: 300000, // 5 minutes to match your jest.setTimeout

    // Coverage example (Vitest v4 changed defaults)
    coverage: {
      provider: 'v8',
      // Include only source files to keep reports meaningful
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        ...configDefaults.exclude,
        'src/testUtilities/**',
        'src/setupTests.js',
        'src/vite-env.d.ts',
      ],
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'json'],
    },
    // Restore previous excludes if your repo is large
    exclude: [
      ...configDefaults.exclude,
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/cypress/**',
    ],
  },
})

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// Vitest defaults exclude only node_modules/.git; restore some of your old excludes if desired
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Image and style mocks: there is no identity-obj-proxy out of the box.
      // For style modules, prefer real CSS via Vite; for CSS-in-JS or plain CSS, you usually don't need mapping.
      // If you still need to mock CSS imports, use test.alias below.
      // For svg, prefer vite-plugin-svgr (already in devDependencies) and import React components from svgs.
    },
  },
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
    // Map some Jest moduleNameMapper cases using alias
    alias: {
      // Map CSS files to a stub if you need to ignore them in tests
      // (Testing Library & jsdom generally don't need CSS for behavior)
      // Example: map css to empty module
      '\\.(css|less|scss)$': '/dev/null/empty-module.js',
      // PNG/JPG/etc. to your existing testUtilities mock
      '\\.(png|jpg|jpeg|gif|webp|bmp)$':
        '/Users/jb/repos/mermaid-webapp/src/testUtilities/mockFile.js',
      // svg: prefer vite-plugin-svgr, but if needed, direct to a stub
      '\\.svg$': '/dev/null/empty-module.js',
      // Specific mapping preserved
      '@fontsource/open-sans': '/dev/null/empty-module.js',
      'react-toastify/dist/ReactToastify.css': '/dev/null/empty-module.js',
    },
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

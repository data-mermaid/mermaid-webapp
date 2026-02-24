import { vi } from 'vitest'

// Shared spy for useTranslation().t() — used by the react-i18next mock in setupTests.js.
// Import this in tests to assert which translation keys were called.
export const mockT = vi.fn((key) => key)

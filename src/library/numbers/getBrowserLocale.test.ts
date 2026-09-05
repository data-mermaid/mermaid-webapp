import { getBrowserLocale } from './getBrowserLocale'

describe('getBrowserLocale', () => {
  it('returns en-US in the jsdom test environment', () => {
    expect(getBrowserLocale()).toBe('en-US')
  })

  it('adds the likely region when the browser reports a language-only tag', () => {
    const original = Object.getOwnPropertyDescriptor(navigator, 'language')
    Object.defineProperty(navigator, 'language', { value: 'de', configurable: true })
    try {
      expect(getBrowserLocale()).toBe('de-DE')
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'language', original)
      }
    }
  })

  it('keeps a region the browser has already supplied', () => {
    const original = Object.getOwnPropertyDescriptor(navigator, 'language')
    Object.defineProperty(navigator, 'language', { value: 'en-GB', configurable: true })
    try {
      expect(getBrowserLocale()).toBe('en-GB')
    } finally {
      if (original) {
        Object.defineProperty(navigator, 'language', original)
      }
    }
  })

  it('falls back to en-US when navigator.language is undefined', () => {
    const original = Object.getOwnPropertyDescriptor(navigator, 'language')
    Object.defineProperty(navigator, 'language', { value: undefined, configurable: true })
    expect(getBrowserLocale()).toBe('en-US')
    if (original) {
      Object.defineProperty(navigator, 'language', original)
    }
  })

  it('falls back to en-US when the locale tag is invalid', () => {
    const original = Object.getOwnPropertyDescriptor(navigator, 'language')
    Object.defineProperty(navigator, 'language', { value: 'en_US', configurable: true })
    expect(getBrowserLocale()).toBe('en-US')
    if (original) {
      Object.defineProperty(navigator, 'language', original)
    }
  })
})

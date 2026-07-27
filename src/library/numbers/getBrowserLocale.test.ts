import { getBrowserLocale } from './getBrowserLocale'

describe('getBrowserLocale', () => {
  it('returns en-US in the jsdom test environment', () => {
    expect(getBrowserLocale()).toBe('en-US')
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

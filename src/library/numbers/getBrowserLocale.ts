export const getBrowserLocale = (): string => {
  const locale = navigator.language ?? 'en-US'
  try {
    return new Intl.NumberFormat(locale).resolvedOptions().locale
  } catch {
    return 'en-US'
  }
}

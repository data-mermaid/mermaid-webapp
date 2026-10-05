export const getBrowserLocale = (): string => {
  const locale = navigator.language ?? 'en-US'
  try {
    // NumberFormat validates the tag but does not add a region, so 'de' stays 'de'.
    // Intl.Locale.maximize() supplies the likely region, giving 'de-DE'.
    const resolved = new Intl.NumberFormat(locale).resolvedOptions().locale
    const { language, region } = new Intl.Locale(resolved).maximize()

    return region ? `${language}-${region}` : resolved
  } catch {
    return 'en-US'
  }
}

const getIndicatorSetFormInitialValues = (indicatorSet) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    title: indicatorSet?.title ?? '',
    report_date: indicatorSet?.report_date ?? today.toISOString().split('T')[0],
    report_year: indicatorSet?.report_year ?? today.getFullYear(),
    // name: siteRecord?.name ?? '',
    // country: siteRecord?.country ?? '',
    // exposure: siteRecord?.exposure ?? '',
    // reef_type: siteRecord?.reef_type ?? '',
    // reef_zone: siteRecord?.reef_zone ?? '',
    // notes: siteRecord?.notes ?? '',
    // latitude: siteRecord?.location?.coordinates[1] ?? '',
    // longitude: siteRecord?.location?.coordinates[0] ?? '',
  }
}

export { getIndicatorSetFormInitialValues }

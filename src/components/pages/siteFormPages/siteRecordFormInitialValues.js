const getSiteInitialValues = (siteRecord) => {
  return {
    name: siteRecord?.name ?? '',
    country: siteRecord?.country ?? '',
    exposure: siteRecord?.exposure ?? '',
    reef_type: siteRecord?.reef_type ?? '',
    reef_zone: siteRecord?.reef_zone ?? '',
    notes: siteRecord?.notes ?? '',
  }
}

export { getSiteInitialValues }

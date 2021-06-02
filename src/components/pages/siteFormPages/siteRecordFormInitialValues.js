const getSiteInitialValues = (siteRecord) => {
  return {
    name: siteRecord?.name ?? '',
    exposure: siteRecord?.exposure ?? '',
    reef_type: siteRecord?.reef_type ?? '',
    reef_zone: siteRecord?.reef_zone ?? '',
  }
}

export { getSiteInitialValues }

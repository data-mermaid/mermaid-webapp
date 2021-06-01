const getSiteInitialValues = (siteRecord) => {
  return {
    name: siteRecord?.name ?? '',
  }
}

export { getSiteInitialValues }

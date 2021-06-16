const getManagementRegimeInitialValues = (managementRegimeRecord) => {
  return {
    name: managementRegimeRecord?.name ?? '',
    name_secondary: managementRegimeRecord?.name_secondary ?? '',
    est_year: managementRegimeRecord?.est_year ?? '',
    size: managementRegimeRecord?.size ?? '',
    compliance: managementRegimeRecord?.compliance ?? '',
    notes: managementRegimeRecord?.notes ?? '',
  }
}

export { getManagementRegimeInitialValues }

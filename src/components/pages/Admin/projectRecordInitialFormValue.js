const getProjectInitialValues = (projectRecord) => {
  return {
    name: projectRecord?.name ?? '',
    notes: projectRecord?.notes ?? '',
  }
}

export { getProjectInitialValues }

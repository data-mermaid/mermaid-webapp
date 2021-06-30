const getProjectInitialValues = (projectRecord) => {
  return {
    name: projectRecord?.name ?? '',
    notes: projectRecord?.notes ?? '',
    tags: projectRecord?.tags,
  }
}

export { getProjectInitialValues }

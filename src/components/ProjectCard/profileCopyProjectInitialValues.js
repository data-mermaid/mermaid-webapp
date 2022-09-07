const getProjectInitialValues = (project) => {
  return {
    name: project?.name ?? '',
    ...project,
  }
}

export { getProjectInitialValues }

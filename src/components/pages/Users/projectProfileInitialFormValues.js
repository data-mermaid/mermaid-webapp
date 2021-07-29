const getProjectProfilesInitialValues = (profileRecord) => {
  return {
    project_profiles: profileRecord || [],
  }
}

export { getProjectProfilesInitialValues }

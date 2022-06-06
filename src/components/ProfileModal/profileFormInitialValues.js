const getProfileInitialValues = (profile) => {
  return {
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    email: profile?.email ?? '',
    ...profile,
  }
}

export { getProfileInitialValues }

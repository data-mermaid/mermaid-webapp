export const getObserverNameOptions = (choices) => {
  return choices.map(({ profile_name, profile, email }) => {
    const profileLabel = profile_name === '(pending user)' ? email : profile_name

    return {
      label: profileLabel,
      value: profile,
    }
  })
}

export const getObserverNames = (observers) => observers.map(({ profile }) => profile)

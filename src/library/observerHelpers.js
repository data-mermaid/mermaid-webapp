export const getObserverNameOptions = (choices) => {
  return choices.map(({ profile_name, profile }) => ({
    label: profile_name,
    value: profile,
  }))
}

export const getObserverNames = (observers) =>
  observers.map(({ profile }) => profile)

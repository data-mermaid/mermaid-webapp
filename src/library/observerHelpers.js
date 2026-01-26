import { getPendingUserProfileName } from '../App/currentUserProfileHelpers'

export const getObserverNameToUse = ({ profile_name, email, profile }) => {
  const emailOrAlternative = email ?? `${profile_name}: ${profile}`

  return profile_name === getPendingUserProfileName() ? emailOrAlternative : profile_name
}

export const getObserverNameOptions = (users) => {
  return users.map((user) => {
    const profileLabel = getObserverNameToUse(user)

    return {
      label: profileLabel,
      value: user.profile,
    }
  })
}

export const getObserverNames = (observers) => observers.map(({ profile }) => profile)

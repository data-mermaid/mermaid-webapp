import { PENDING_USER_PROFILE_NAME } from './constants/constants'

export const getObserverNameToUse = ({ profile_name, email, profile }) => {
  const emailOrAlternative = email ?? `${profile_name}: ${profile}`

  return profile_name === PENDING_USER_PROFILE_NAME ? emailOrAlternative : profile_name
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

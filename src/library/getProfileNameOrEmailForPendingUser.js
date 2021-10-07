// new user profile name won't be 'none none' as of now, it will be subject to change to 'pending user'.
export const getProfileNameOrEmailForPendingUser = (user) =>
  user.profile_name === 'None None' ? user.email : user.profile_name

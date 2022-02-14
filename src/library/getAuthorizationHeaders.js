export const getAuthorizationHeaders = async (getAccessToken) => {
  return {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  }
}

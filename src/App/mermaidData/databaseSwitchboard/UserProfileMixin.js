const UserProfileMixin = (Base) =>
  class extends Base {
    getUserProfile = () => {
      if (this._isOnlineAuthenticatedAndLoading) {
        return Promise.resolve(undefined)
      }
      if (this._isOnlineAuthenticatedAndReady) {
        return this._authenticatedAxios
          .get(`${this._apiBaseUrl}/me`)
          .then((apiResults) => {
            const userFromApi = apiResults.data

            if (!userFromApi) {
              throw Error('User Profile not returned from API')
            }

            const userToStore = {
              id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
              user: userFromApi,
            }

            return this._dexieInstance.currentUser
              .put(userToStore)
              .then(() => userFromApi)
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.currentUser.toArray().then((results) => {
          const user = results[0]

          if (!user) {
            throw Error('User Profile not returned from offline storage')
          }

          return user
        })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default UserProfileMixin

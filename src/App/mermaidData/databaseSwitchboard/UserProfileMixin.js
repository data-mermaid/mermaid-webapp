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
            const user = apiResults.data

            if (!user) {
              throw Error('User Profile not returned from API')
            }

            return this._dexieInstance.currentUser.put(user).then(() => user)
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

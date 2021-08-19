import { getObjectById } from '../../../library/getObjectById'

const SitesMixin = (Base) =>
  class extends Base {
    getSitesWithoutOfflineDeleted = async (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_sites
            .toArray()
            .then((sites) =>
              sites.filter(
                (site) => site.project === projectId && !site._deleted,
              ),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSite = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexieInstance.project_sites.get(id)
    }

    getSiteRecordsForUIDisplay = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getSitesWithoutOfflineDeleted(projectId),
            this.getChoices(),
          ]).then(([sites, choices]) => {
            const { reeftypes, reefzones, reefexposures } = choices

            return sites.map((record) => {
              return {
                ...record,
                uiLabels: {
                  name: record.name,
                  reefType: getObjectById(reeftypes.data, record.reef_type)
                    .name,
                  reefZone: getObjectById(reefzones.data, record.reef_zone)
                    .name,
                  exposure: getObjectById(reefexposures.data, record.exposure)
                    .name,
                },
              }
            })
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SitesMixin

import { getObjectById } from '../../../library/getObjectById'

const SitesMixin = (Base) =>
  class extends Base {
    getSites = async (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_sites.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSite = ({ id, projectId }) => {
      if (!id || !projectId) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSites(projectId).then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSiteRecordsForUIDisplay = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? Promise.all([this.getSites(projectId), this.getChoices()]).then(
            ([sites, choices]) => {
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
            },
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default SitesMixin

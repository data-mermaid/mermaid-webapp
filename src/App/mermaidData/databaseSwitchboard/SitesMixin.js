import { getObjectById } from '../../../library/getObjectById'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const SitesMixin = (Base) =>
  class extends Base {
    getSites = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.sites)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getSite = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSites().then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getSiteRecordsForUIDisplay = () => {
      return this._isAuthenticatedAndReady
        ? Promise.all([this.getSites(), this.getChoices()]).then(
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

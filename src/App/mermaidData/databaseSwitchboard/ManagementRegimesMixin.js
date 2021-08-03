import { getObjectById } from '../../../library/getObjectById'
import mockMermaidData from '../../../testUtilities/mockMermaidData'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
    getManagementRegimes = () =>
      this._isAuthenticatedAndReady
        ? Promise.resolve(mockMermaidData.management_regimes)
        : Promise.reject(this._notAuthenticatedAndReadyError)

    getManagementRegime = (id) => {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getManagementRegimes().then((records) =>
            records.find((record) => record.id === id),
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegimeRecordsForUiDisplay = () => {
      return this._isAuthenticatedAndReady
        ? Promise.all([this.getManagementRegimes(), this.getChoices()]).then(
            ([managementRegimes, choices]) => {
              const { managementcompliances } = choices

              return managementRegimes.map((record) => {
                return {
                  ...record,
                  uiLabels: {
                    name: record.name,
                    estYear: record.est_year,
                    compliance: getObjectById(
                      managementcompliances.data,
                      record.compliance,
                    )?.name,
                    openAccess: record.open_access,
                    accessRestriction: record.access_restriction,
                    periodicClosure: record.periodic_closure,
                    sizeLimits: record.size_limits,
                    gearRestriction: record.gear_restriction,
                    speciesRestriction: record.species_restriction,
                    noTake: record.no_take,
                  },
                }
              })
            },
          )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin

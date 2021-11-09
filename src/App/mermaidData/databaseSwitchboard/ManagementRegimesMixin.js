import { getObjectById } from '../../../library/getObjectById'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
    getManagementRegimesWithoutOfflineDeleted = function getManagementRegimesWithoutOfflineDeleted(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_managements
            .toArray()
            .then((managementRegimes) =>
              managementRegimes.filter(
                (managementRegime) =>
                  managementRegime.project === projectId && !managementRegime._deleted,
              ),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegime = function getManagementRegime(id) {
      if (!id) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexieInstance.project_managements.get(id)
    }

    getManagementRegimeRecordsForUiDisplay = function getManagementRegimeRecordsForUiDisplay(
      projectId,
    ) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getManagementRegimesWithoutOfflineDeleted(projectId),
            this.getChoices(),
          ]).then(([managementRegimes, choices]) => {
            const { managementcompliances } = choices

            return managementRegimes.map((record) => {
              return {
                ...record,
                uiLabels: {
                  name: record.name,
                  estYear: record.est_year,
                  compliance: getObjectById(managementcompliances.data, record.compliance)?.name,
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
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin

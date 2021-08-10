import { getObjectById } from '../../../library/getObjectById'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
    getManagementRegimes = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_managements.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegime = ({ id, projectId }) => {
      if (!id || !projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexieInstance.project_managements
            .toArray()
            .then((records) => records.find((record) => record.id === id))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegimeRecordsForUiDisplay = (projectId) => {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? Promise.all([
            this.getManagementRegimes(projectId),
            this.getChoices(),
          ]).then(([managementRegimes, choices]) => {
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
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin

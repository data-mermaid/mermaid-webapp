import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'

const ManagementRegimesMixin = (Base) =>
  class extends Base {
    #getManagementRegimeReadyForPush = function getManagementRegimeReadyForPush({
      managementRegime,
      projectId,
    }) {
      const idToSubmit = managementRegime.id ?? createUuid()
      const projectIdToSubmit = managementRegime.project ?? projectId

      return {
        ...managementRegime,
        id: idToSubmit,
        project: projectIdToSubmit,
        uiState_pushToApi: true,
      }
    }

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

    saveManagementRegime = async function saveManagementRegime({ managementRegime, projectId }) {
      if (!managementRegime || !projectId) {
        throw new Error('saveManagementRegime expects record and projectId parameters')
      }

      const managementToSubmit = this.#getManagementRegimeReadyForPush({
        managementRegime,
        projectId,
      })

      if (this._isOnlineAuthenticatedAndReady) {
        await this._dexieInstance.project_managements.put(managementToSubmit)

        return this._authenticatedAxios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_managements: [managementToSubmit],
            },
            {
              params: {
                force: true,
              },
            },
          )
          .then((response) => {
            console.log('response ', response)
            const [managementRegimeResponseFromApiPush] = response.data.project_managements

            const isManagementRegimeStatusCodeSuccessful = this._isStatusCodeSuccessful(
              managementRegimeResponseFromApiPush.status_code,
            )

            console.log(
              'isManagementRegimeStatusCodeSuccessful ',
              isManagementRegimeStatusCodeSuccessful,
            )

            if (isManagementRegimeStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullEverythingForAProjectButChoices(projectId)
                .then((_dataSetsReturnedFromApiPull) => {
                  const managementRegimeWithExtraPropertiesWrittenByApi =
                    managementRegimeResponseFromApiPush.data

                  return managementRegimeWithExtraPropertiesWrittenByApi
                })
            }

            return Promise.reject(
              new Error(
                'the API management regime returned from saveManagementRegime doesnt have a successful status code',
              ),
            )
          })
      }
      if (this._isOfflineAuthenticatedAndReady) {
        return this._dexieInstance.project_managements
          .put(managementToSubmit)
          .then(() => managementToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin

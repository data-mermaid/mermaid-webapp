import axios from 'axios'
import { createUuid } from '../../../library/createUuid'
import { getObjectById } from '../../../library/getObjectById'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

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
        ? this._dexiePerUserDataInstance.project_managements
            .toArray()
            .then((managementRegimes) =>
              managementRegimes.filter(
                (managementRegime) =>
                  managementRegime.project === projectId && !managementRegime._deleted,
              ),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getManagementRegimesExcludedInCurrentProject =
      async function getManagementRegimesExcludedInCurrentProject(projectId) {
        if (!projectId) {
          return Promise.reject(this._operationMissingParameterError)
        }

        return this._isOnlineAuthenticatedAndReady
          ? axios
              .get(`${this._apiBaseUrl}/managements/`, {
                params: {
                  exclude_projects: projectId,
                  include_fields: `project_name`,
                  unique: projectId,
                  limit: 2500,
                },
                ...(await getAuthorizationHeaders(this._getAccessToken)),
              })
              .then((apiResults) => apiResults.data)
          : Promise.reject(this._notAuthenticatedAndReadyError)
      }

    getManagementRegime = function getManagementRegime(id) {
      if (!id) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.project_managements.get(id)
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
        await this._dexiePerUserDataInstance.project_managements.put(managementToSubmit)

        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              project_managements: [managementToSubmit],
            },
            {
              params: {
                force: true,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [managementRegimeResponseFromApiPush] = response.data.project_managements

            const isManagementRegimeStatusCodeSuccessful = this._isStatusCodeSuccessful(
              managementRegimeResponseFromApiPush.status_code,
            )

            if (isManagementRegimeStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
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
        return this._dexiePerUserDataInstance.project_managements
          .put(managementToSubmit)
          .then(() => managementToSubmit)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ManagementRegimesMixin

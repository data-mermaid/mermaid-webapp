import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { getPaginatedMermaidData } from '../getPaginatedMermaidData'

const ProjectsMixin = (Base) =>
  class extends Base {
    getOfflineReadyProjectIds = function getOfflineReadyProjectIds() {
      return this._dexiePerUserDataInstance.uiState_offlineReadyProjects.toArray()
    }

    getProjects = function getProjects() {
      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.projects.toArray()
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getProject = function getProject(id) {
      if (!id) {
        Promise.reject(this._operationMissingIdParameterError)
      }

      if (!this._isAuthenticatedAndReady) {
        Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return this._dexiePerUserDataInstance.projects.get(id)
    }

    saveProject = async function saveProject({ projectId, editedValues }) {
      if (!projectId || !editedValues) {
        throw new Error('the invocation of saveProject is missing one or more parameters.')
      }

      const projectToEdit = await this.getProject(projectId)
      const editedProject = { ...projectToEdit, ...editedValues, uiState_pushToApi: true }

      return this._dexiePerUserDataInstance.projects.put(editedProject).then(() => {
        return this._apiSyncInstance
          .pushThenPullAllProjectDataExceptChoices(projectId)
          .then(async ({ pushData, pullData }) => {
            const projectPushStatusCode = pushData.data.projects[0].status_code
            const projectStatusMessage = pushData.data.projects[0].message
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(projectPushStatusCode)

            if (!isApiResponseSuccessful && projectStatusMessage === 'Validation Error') {
              const oldProjectName = projectToEdit.name
              const editedValuesCopy = editedValues

              editedValuesCopy.name = oldProjectName

              const editedProjectWithOldProjectName = {
                ...projectToEdit,
                ...editedValuesCopy,
                uiState_pushToApi: true,
              }

              await this._dexiePerUserDataInstance.projects.put(editedProjectWithOldProjectName)

              return Promise.reject(new Error(projectStatusMessage))
            }

            if (!isApiResponseSuccessful) {
              return Promise.reject(new Error(projectStatusMessage))
            }

            const editedProjectFromApi = pullData.data.projects.updates[0]

            return editedProjectFromApi
          })
      })
    }

    getProjectTags = async function getProjectTags() {
      if (!this._isOnlineAuthenticatedAndReady) {
        return Promise.reject(this._notAuthenticatedAndReadyError)
      }

      return await getPaginatedMermaidData({
        url: `${this._apiBaseUrl}/projecttags/`,
        authorizationHeaders: await getAuthorizationHeaders(this._getAccessToken),
        axios,
        errorCallback: () => {
          return Promise.reject(this._notAuthenticatedAndReadyError)
        },
      })
    }

    getProjectProfiles = function getProjectProfiles(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this._dexiePerUserDataInstance.project_profiles
            .toArray()
            .then((projectProfiles) =>
              projectProfiles.filter((projectProfile) => projectProfile.project === projectId),
            )
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    editProjectProfileRole = async function editProjectProfileRole({
      projectId,
      profileId,
      roleCode,
    }) {
      if (!projectId || !profileId || !roleCode) {
        throw new Error(
          'the invocation of editProjectProfileRole is missing one or more parameters.',
        )
      }
      if (this._isAuthenticatedAndReady) {
        const profileToEdit = await this._dexiePerUserDataInstance.project_profiles
          .toArray()
          .then((projectProfiles) =>
            projectProfiles.find(
              (projectProfile) =>
                projectProfile.project === projectId && projectProfile.id === profileId,
            ),
          )

        const editedProfile = { ...profileToEdit, role: roleCode, uiState_pushToApi: true }

        return this._dexiePerUserDataInstance.project_profiles.put(editedProfile).then(() =>
          this._apiSyncInstance
            .pushThenPullAllProjectDataExceptChoices(projectId)
            .then(({ pullData }) => {
              const editedProfileFromApi = pullData.data.project_profiles.updates[0]

              return editedProfileFromApi
            }),
        )
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getUserProfile = async function getUserProfile(email) {
      if (!email) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? axios
            .get(`${this._apiBaseUrl}/profiles/`, {
              params: {
                email,
              },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            })
            .then((profilesData) => {
              return profilesData
            })
            .catch(() => Promise.reject(this._notAuthenticatedAndReadyError))
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addUser = async function addUser(email, projectId) {
      if (!projectId || !email) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/${projectId}/add_profile/`,
            {
              email,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    copyProject = async function addProject(originalProjectId, newProjectName, sendEmail) {
      if (!originalProjectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/copy_project/`,
            {
              new_project_name: newProjectName,
              original_project_id: originalProjectId,
              notify_users: sendEmail,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance.pullAllProjects().then((pullResponse) => {
                return pullResponse.data.projects.updates[0]
              })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addProject = async function addProject(newProjectName) {
      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/`,
            {
              name: newProjectName,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance.pullAllProjects().then((pullResponse) => {
                return pullResponse.data.projects.updates[0]
              })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    addDemoProject = async function addDemoProject() {
      if (this._isAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/projects/create_demo/`,
            {},
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance.pullAllProjects().then((pullResponse) => {
                return pullResponse.data.projects.updates[0]
              })
            }

            return Promise.reject(new Error('The API status is unsuccessful'))
          })
          .catch((error) => {
            return Promise.reject(error)
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    deleteProject = async function deleteProject(project, projectId) {
      const hasCorrespondingProjectInTheApi = !!project._last_revision_num

      const projectToBeDeleted = {
        ...project,
        uiStatePush_pushToApi: true,
        _deleted: true,
      }

      if (hasCorrespondingProjectInTheApi && this._isOnlineAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            { projects: [projectToBeDeleted] },
            {
              params: { force: true },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [recordResponseFromApiPush] = response.data.projects

            const isRecordStatusCodeSuccessful = recordResponseFromApiPush.status_code === 202

            if (isRecordStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ pullData }) => {
                  return pullData
                })
            }

            return Promise.reject(
              new Error(
                'the API record returned from deleteProject doesnt have a successful status code',
              ),
            )
          })
      }

      if (!hasCorrespondingProjectInTheApi && this._isOnlineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.projects.delete(project.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    transferSampleUnits = async function transferSampleUnits(
      projectId,
      fromProfileId,
      toProfileId,
    ) {
      if (!projectId || !fromProfileId || !toProfileId) {
        Promise.reject(this._operationMissingParameterError)
      }

      if (this._isAuthenticatedAndReady) {
        return axios
          .put(
            `${this._apiBaseUrl}/projects/${projectId}/transfer_sample_units/`,
            {
              from_profile: fromProfileId,
              to_profile: toProfileId,
            },
            await getAuthorizationHeaders(this._getAccessToken),
          )
          .then((response) => {
            const isApiResponseSuccessful = this._isStatusCodeSuccessful(response.status)

            if (isApiResponseSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(() => {
                  return response.data
                })
            }

            return Promise.reject(
              new Error(
                'the API record returned from addUser doesnt have a successful status code',
              ),
            )
          })
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    removeUser = async function removeUser(user, projectId) {
      const hasCorrespondingRecordInTheApi = !!user._last_revision_num

      const recordMarkedToBeDeleted = {
        ...user,
        uiStatePush_pushToApi: true,
        _deleted: true,
      }

      if (hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            { project_profiles: [recordMarkedToBeDeleted] },
            {
              params: { force: true },
              ...(await getAuthorizationHeaders(this._getAccessToken)),
            },
          )
          .then((response) => {
            const [recordResponseFromApiPush] = response.data.project_profiles
            const isRecordStatusCodeSuccessful = this._isStatusCodeSuccessful(
              recordResponseFromApiPush.status_code,
            )

            if (isRecordStatusCodeSuccessful) {
              return this._apiSyncInstance
                .pushThenPullAllProjectDataExceptChoices(projectId)
                .then(({ pullData }) => {
                  return pullData
                })
            }

            return Promise.reject(
              new Error(
                'the API record returned from removeUser doesnt have a successful status code',
              ),
            )
          })
      }

      if (!hasCorrespondingRecordInTheApi && this._isOnlineAuthenticatedAndReady) {
        return this._dexiePerUserDataInstance.project_profiles.delete(user.id)
      }

      return Promise.reject(this._notAuthenticatedAndReadyError)
    }

    setProjectAsOfflineReady = function setProjectAsOfflineReady(projectId) {
      if (!projectId) {
        return Promise.reject(new Error('missing projectId parameter'))
      }

      return this._apiSyncInstance.pushThenPullAllProjectDataExceptChoices(projectId)
    }

    unsetProjectAsOfflineReady = function unsetProjectAsOfflineReady(projectId) {
      if (!projectId) {
        return Promise.reject(new Error('missing projectId parameter'))
      }

      return this._apiSyncInstance.pushThenRemoveProjectFromOfflineStorage(projectId)
    }
  }

export default ProjectsMixin

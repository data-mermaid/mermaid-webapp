import axios from '../../../library/axiosRetry'
import { pullApiData } from '../pullApiData'

const SyncApiDataIntoOfflineStorage = class {
  _apiBaseUrl

  _dexiePerUserDataInstance

  #getTableNamesWhereSyncingWasRejectedListedPerProjectFromSyncPushError =
    function getTableNamesWhereSyncingWasRejectedListedPerProjectFromSyncPushError(pushResponse) {
      const projectsWithSyncErrors = {}

      try {
        const responseData = pushResponse.data

        const mermaidApiSyncTableNames = Object.keys(responseData)

        mermaidApiSyncTableNames.forEach((apiSyncTableName) => {
          responseData[apiSyncTableName].forEach((itemSyncResponseObject) => {
            const isSync403 = itemSyncResponseObject.status_code === 403
            const syncErrorProjectName = itemSyncResponseObject.data.project_name
            const syncErrorProjectId = itemSyncResponseObject.data.project_id

            // to differentiate from other 403s, the proxy metric here is that if the
            // response includes a project name, this means a user in not allowed to sync
            const isUserDeniedFromSyncingToProject = isSync403 && syncErrorProjectName

            if (isUserDeniedFromSyncingToProject) {
              const projectsOtherApiDataTablesThatRejectedSyncing =
                projectsWithSyncErrors[syncErrorProjectId]?.apiDataTablesThatRejectedSyncing ?? []

              projectsWithSyncErrors[syncErrorProjectId] = {
                name: syncErrorProjectName,
                apiDataTablesThatRejectedSyncing: [
                  ...projectsOtherApiDataTablesThatRejectedSyncing,
                  apiSyncTableName,
                ],
              }
            }
          })
        })

        // the format of the returned object will be
        // { projectId: { name: string, apiDataTablesThatRejectedSyncing: string[] } }
        return projectsWithSyncErrors
      } catch (error) {
        console.error('Not able to assess syncing success', error)

        return {}
      }
    }

  #getOnlyModifiedAndDeletedItems = (dataList) => {
    return (
      dataList
        // New, edited, and deleted items will all have a uiState_pushToApi flag locally which can be used to filter
        .filter((item) => item.uiState_pushToApi)
        // Destructuring assignment with "rest property" removes uiState_pushToApi so it will be omitted from the API request
        // eslint-disable-next-line no-unused-vars
        .map(({ uiState_pushToApi, ...keepProps }) => keepProps)
    )
  }

  #handleUserDeniedSyncPush

  constructor({ apiBaseUrl, dexiePerUserDataInstance, getAccessToken, handleUserDeniedSyncPush }) {
    if (!apiBaseUrl || !dexiePerUserDataInstance || !getAccessToken || !handleUserDeniedSyncPush) {
      throw new Error('SyncApiDataIntoOfflineStorage instantiated with missing parameter')
    }
    this._dexiePerUserDataInstance = dexiePerUserDataInstance
    this._apiBaseUrl = apiBaseUrl
    this._getAccessToken = getAccessToken
    this.#handleUserDeniedSyncPush = handleUserDeniedSyncPush
  }

  pullAllProjects = () => {
    const apiProjectsToPull = ['projects']

    return pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: apiProjectsToPull,
    })
  }

  #pullAllDataExceptSpecificProject = () => {
    const apiDataNamesToPullNonProject = [
      'benthic_attributes',
      'choices',
      'fish_families',
      'fish_genera',
      'fish_species',
      'projects',
    ]

    return pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: apiDataNamesToPullNonProject,
    })
  }

  #pullOfflineProjects = async () => {
    const offlineReadyProjects =
      await this._dexiePerUserDataInstance.uiState_offlineReadyProjects.toArray()

    const apiDataNamesToPullNonProject = [
      'collect_records',
      'project_managements',
      'project_profiles',
      'project_sites',
    ]

    const pullProjectPromises = offlineReadyProjects.map((project) =>
      pullApiData({
        dexiePerUserDataInstance: this._dexiePerUserDataInstance,
        getAccessToken: this._getAccessToken,
        apiBaseUrl: this._apiBaseUrl,
        apiDataNamesToPull: apiDataNamesToPullNonProject,
        projectId: project.id,
      }),
    )

    return Promise.all(pullProjectPromises)
  }

  pushChanges = async () => {
    return Promise.all([
      this._dexiePerUserDataInstance.benthic_attributes.toArray(),
      this._dexiePerUserDataInstance.collect_records.toArray(),
      this._dexiePerUserDataInstance.fish_species.toArray(),
      this._dexiePerUserDataInstance.project_managements.toArray(),
      this._dexiePerUserDataInstance.project_profiles.toArray(),
      this._dexiePerUserDataInstance.project_sites.toArray(),
      this._dexiePerUserDataInstance.projects.toArray(),
      this._getAccessToken(),
    ]).then(
      ([
        benthic_attributes,
        collect_records,
        fish_species,
        project_managements,
        project_profiles,
        project_sites,
        projects,
        token,
      ]) => {
        return axios
          .post(
            `${this._apiBaseUrl}/push/`,
            {
              benthic_attributes: this.#getOnlyModifiedAndDeletedItems(benthic_attributes),
              collect_records: this.#getOnlyModifiedAndDeletedItems(collect_records),
              fish_species: this.#getOnlyModifiedAndDeletedItems(fish_species),
              project_managements: this.#getOnlyModifiedAndDeletedItems(project_managements),
              project_profiles: this.#getOnlyModifiedAndDeletedItems(project_profiles),
              project_sites: this.#getOnlyModifiedAndDeletedItems(project_sites),
              projects: this.#getOnlyModifiedAndDeletedItems(projects),
            },
            {
              params: {
                force: true,
              },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((response) => {
            const projectsWithSyncErrors =
              this.#getTableNamesWhereSyncingWasRejectedListedPerProjectFromSyncPushError(response)
            const areThereSyncErrors = Object.keys(projectsWithSyncErrors).length

            if (areThereSyncErrors) {
              this.#handleUserDeniedSyncPush(projectsWithSyncErrors)
            }

            return response
          })
      },
    )
  }

  pushThenPullEverything = async () => {
    await this.pushChanges()

    return Promise.all([this.#pullAllDataExceptSpecificProject(), this.#pullOfflineProjects()])
  }

  pushThenPullFishOrBenthicAttributes = async (fishOrBenthicAttributesData) => {
    await this.pushChanges()

    return pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: [fishOrBenthicAttributesData],
    })
  }

  pushThenPullAllProjectData = async (projectId) => {
    const allTheDataNames = [
      'benthic_attributes',
      'choices',
      'collect_records',
      'fish_families',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]

    await this.pushChanges()

    const pullResponse = await pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: allTheDataNames,
      projectId,
    })

    await this._dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }

  pullAllProjectDataExceptChoices = async (projectId) => {
    const apiDataNamesToPull = [
      'benthic_attributes',
      'collect_records',
      'fish_families',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]
    const pullResponse = await pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull,
      projectId,
    })

    await this._dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }

  pushThenPullAllProjectDataExceptChoices = async (projectId) => {
    return this.pushChanges().then(async (pushResponse) => {
      const pullData = await this.pullAllProjectDataExceptChoices(projectId)
      const pushData = pushResponse

      return { pushData, pullData }
    })
  }

  pushThenRemoveProjectFromOfflineStorage = async (projectId) => {
    await this.pushChanges()

    const removeProjectDataFromUsersDataDatabase = this._dexiePerUserDataInstance.transaction(
      'rw',
      this._dexiePerUserDataInstance.collect_records,
      this._dexiePerUserDataInstance.project_managements,
      this._dexiePerUserDataInstance.project_profiles,
      this._dexiePerUserDataInstance.project_sites,
      this._dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,

      async () => {
        this._dexiePerUserDataInstance.collect_records.where({ project: projectId }).delete()
        this._dexiePerUserDataInstance.project_managements.where({ project: projectId }).delete()
        this._dexiePerUserDataInstance.project_profiles.where({ project: projectId }).delete()
        this._dexiePerUserDataInstance.project_sites.where({ project: projectId }).delete()

        this._dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
          .where('[dataType+projectId]')
          .anyOf([
            ['collect_records', projectId],
            ['project_managements', projectId],
            ['project_profiles', projectId],
            ['project_sites', projectId],
          ])
          .delete()
      },
    )

    const removeProjectDataFromUiStateDatabase =
      this._dexiePerUserDataInstance.uiState_offlineReadyProjects.delete(projectId)

    return Promise.all([
      removeProjectDataFromUsersDataDatabase,
      removeProjectDataFromUiStateDatabase,
    ])
  }
}

export default SyncApiDataIntoOfflineStorage

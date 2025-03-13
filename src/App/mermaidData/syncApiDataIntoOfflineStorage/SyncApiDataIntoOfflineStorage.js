import axios from '../../../library/axiosRetry'
import { pullApiData } from '../pullApiData'

const SyncApiDataIntoOfflineStorage = class {
  #apiBaseUrl

  #dexiePerUserDataInstance

  #getAccessToken

  #getTableNamesWhereUserWasDeniedPushSyncListedPerProject =
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

              const uniqueApiDataTablesThatRejectedSyncing = [
                ...new Set([...projectsOtherApiDataTablesThatRejectedSyncing, apiSyncTableName]),
              ]

              projectsWithSyncErrors[syncErrorProjectId] = {
                name: syncErrorProjectName,
                apiDataTablesThatRejectedSyncing: uniqueApiDataTablesThatRejectedSyncing,
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
        .map(({ uiState_pushToApi, ...keepProps }) => keepProps) // eslint-disable-line @typescript-eslint/no-unused-vars
    )
  }

  #handleNested500SyncError

  #handleUserDeniedSyncPull

  #handleUserDeniedSyncPush

  constructor({
    apiBaseUrl,
    dexiePerUserDataInstance,
    getAccessToken,
    handleUserDeniedSyncPull,
    handleUserDeniedSyncPush,
    handleNested500SyncError,
  }) {
    if (
      !apiBaseUrl ||
      !dexiePerUserDataInstance ||
      !getAccessToken ||
      !handleUserDeniedSyncPull ||
      !handleUserDeniedSyncPush ||
      !handleNested500SyncError
    ) {
      throw new Error('SyncApiDataIntoOfflineStorage instantiated with missing parameter')
    }
    this.#dexiePerUserDataInstance = dexiePerUserDataInstance
    this.#apiBaseUrl = apiBaseUrl
    this.#getAccessToken = getAccessToken
    this.#handleUserDeniedSyncPull = handleUserDeniedSyncPull
    this.#handleUserDeniedSyncPush = handleUserDeniedSyncPush
    this.#handleNested500SyncError = handleNested500SyncError
  }

  pullAllProjects = () => {
    const apiProjectsToPull = ['projects']

    return pullApiData({
      apiBaseUrl: this.#apiBaseUrl,
      apiDataNamesToPull: apiProjectsToPull,
      dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
      getAccessToken: this.#getAccessToken,
      handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
    })
  }

  #pullAllDataExceptSpecificProject = () => {
    const apiDataNamesToPullNonProject = [
      'benthic_attributes',
      'choices',
      'fish_families',
      'fish_groupings',
      'fish_genera',
      'fish_species',
      'projects',
    ]

    return pullApiData({
      apiBaseUrl: this.#apiBaseUrl,
      apiDataNamesToPull: apiDataNamesToPullNonProject,
      dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
      getAccessToken: this.#getAccessToken,
      handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
    })
  }

  #pullOfflineProjects = async () => {
    const offlineReadyProjects =
      await this.#dexiePerUserDataInstance.uiState_offlineReadyProjects.toArray()

    const apiDataNamesToPullNonProject = [
      'collect_records',
      'project_managements',
      'project_profiles',
      'project_sites',
    ]

    const pullProjectPromises = offlineReadyProjects.map((project) =>
      pullApiData({
        apiBaseUrl: this.#apiBaseUrl,
        apiDataNamesToPull: apiDataNamesToPullNonProject,
        dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
        getAccessToken: this.#getAccessToken,
        handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
        projectId: project.id,
      }),
    )

    return Promise.all(pullProjectPromises)
  }

  pushChanges = async () => {
    return Promise.all([
      this.#dexiePerUserDataInstance.benthic_attributes.toArray(),
      this.#dexiePerUserDataInstance.collect_records.toArray(),
      this.#dexiePerUserDataInstance.fish_species.toArray(),
      this.#dexiePerUserDataInstance.project_managements.toArray(),
      this.#dexiePerUserDataInstance.project_profiles.toArray(),
      this.#dexiePerUserDataInstance.project_sites.toArray(),
      this.#dexiePerUserDataInstance.projects.toArray(),
      this.#getAccessToken(),
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
            `${this.#apiBaseUrl}/push/`,
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
            const allSyncStatusCodes = Object.entries(response.data)
              .flatMap((apiTableSyncResponseEntry) => {
                return apiTableSyncResponseEntry[1]
              })
              .map((syncResponses) => {
                return syncResponses.status_code
              })

            const areThereUserDeniedPushSyncErrors = !!allSyncStatusCodes.find(
              (statusCode) => statusCode === 403,
            )

            const areThereStatusCode500SyncErrors = !!allSyncStatusCodes.find(
              (statusCode) => statusCode === 500,
            )

            if (areThereUserDeniedPushSyncErrors) {
              const projectsWithUserDeniedSyncErrors =
                this.#getTableNamesWhereUserWasDeniedPushSyncListedPerProject(response)

              this.#handleUserDeniedSyncPush(projectsWithUserDeniedSyncErrors)
            }

            if (areThereStatusCode500SyncErrors) {
              this.#handleNested500SyncError()
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
      apiBaseUrl: this.#apiBaseUrl,
      apiDataNamesToPull: [fishOrBenthicAttributesData],
      dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
      getAccessToken: this.#getAccessToken,
      handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
    })
  }

  pushThenPullAllProjectData = async (projectId) => {
    const allTheDataNames = [
      'benthic_attributes',
      'choices',
      'collect_records',
      'fish_families',
      'fish_groupings',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]

    await this.pushChanges()

    const pullResponse = await pullApiData({
      apiBaseUrl: this.#apiBaseUrl,
      apiDataNamesToPull: allTheDataNames,
      dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
      getAccessToken: this.#getAccessToken,
      handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
      projectId,
    })

    await this.#dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }

  pullAllProjectDataExceptChoices = async (projectId) => {
    // usage notes. This function skips pulling choices data because it rarely changes
    const apiDataNamesToPull = [
      'benthic_attributes',
      'collect_records',
      'fish_families',
      'fish_groupings',
      'fish_genera',
      'fish_species',
      'project_managements',
      'project_profiles',
      'project_sites',
      'projects',
    ]
    const pullResponse = await pullApiData({
      apiBaseUrl: this.#apiBaseUrl,
      apiDataNamesToPull,
      dexiePerUserDataInstance: this.#dexiePerUserDataInstance,
      getAccessToken: this.#getAccessToken,
      handleUserDeniedSyncPull: this.#handleUserDeniedSyncPull,
      projectId,
    })

    await this.#dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
  }

  pushThenPullAllProjectDataExceptChoices = async (projectId) => {
    // usage notes. This function skips pulling choices data because it rarely changes
    return this.pushChanges().then(async (pushResponse) => {
      const pullData = await this.pullAllProjectDataExceptChoices(projectId)
      const pushData = pushResponse

      return { pushData, pullData }
    })
  }

  pushThenRemoveProjectFromOfflineStorage = async (projectId) => {
    await this.pushChanges()

    const removeProjectDataFromUsersDataDatabase = this.#dexiePerUserDataInstance.transaction(
      'rw',
      this.#dexiePerUserDataInstance.collect_records,
      this.#dexiePerUserDataInstance.project_managements,
      this.#dexiePerUserDataInstance.project_profiles,
      this.#dexiePerUserDataInstance.project_sites,
      this.#dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,

      async () => {
        this.#dexiePerUserDataInstance.collect_records.where({ project: projectId }).delete()
        this.#dexiePerUserDataInstance.project_managements.where({ project: projectId }).delete()
        this.#dexiePerUserDataInstance.project_profiles.where({ project: projectId }).delete()
        this.#dexiePerUserDataInstance.project_sites.where({ project: projectId }).delete()

        this.#dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
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
      this.#dexiePerUserDataInstance.uiState_offlineReadyProjects.delete(projectId)

    return Promise.all([
      removeProjectDataFromUsersDataDatabase,
      removeProjectDataFromUiStateDatabase,
    ])
  }
}

export default SyncApiDataIntoOfflineStorage

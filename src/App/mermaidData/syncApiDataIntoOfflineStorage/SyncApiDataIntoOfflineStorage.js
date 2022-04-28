import axios from 'axios'
import { pullApiData } from '../pullApiData'

// const removeObjectKeysReducer = (previous, current) => {
//   const {[current]: dummy, remainder}
// }

const SyncApiDataIntoOfflineStorage = class {
  _apiBaseUrl

  _dexiePerUserDataInstance

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

  constructor({ dexiePerUserDataInstance, apiBaseUrl, getAccessToken }) {
    this._dexiePerUserDataInstance = dexiePerUserDataInstance
    this._apiBaseUrl = apiBaseUrl
    this._getAccessToken = getAccessToken
  }

  #pullEverythingButProjectRelated = () => {
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
        return axios.post(
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
      },
    )
  }

  pushThenPullEverything = async () => {
    await this.pushChanges()

    return Promise.all([this.#pullEverythingButProjectRelated(), this.#pullOfflineProjects()])
  }

  pushThenPullSpecies = async () => {
    await this.pushChanges()

    return pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: ['fish_species'],
    })
  }

  pushThenPullEverythingForAProject = async (projectId) => {
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

  pushThenPullEverythingForAProjectButChoices = async (projectId) => {
    const apiDataNamesToPullNonProject = [
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

    await this.pushChanges()

    const pullResponse = await pullApiData({
      dexiePerUserDataInstance: this._dexiePerUserDataInstance,
      getAccessToken: this._getAccessToken,
      apiBaseUrl: this._apiBaseUrl,
      apiDataNamesToPull: apiDataNamesToPullNonProject,
      projectId,
    })

    await this._dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
      id: projectId,
    })

    return pullResponse
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

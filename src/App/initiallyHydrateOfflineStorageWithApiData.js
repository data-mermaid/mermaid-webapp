import axios from 'axios'
import mockMermaidData from '../testUtilities/mockMermaidData'
import {
  getLastRevisionNumbersPulled,
  persistLastRevisionNumbersPulled,
} from './mermaidData/lastRevisionNumbers'

export const initiallyHydrateOfflineStorageWithApiData = async ({
  dexieInstance,
  auth0Token,
  apiBaseUrl,
}) => {
  const apiDataNames = [
    'benthic_attributes',
    'choices',
    'fish_families',
    'fish_genera',
    'fish_species',
    'projects',
  ]

  const lastRevisionNumbersPulled = await getLastRevisionNumbersPulled({
    dexieInstance,
  })

  // were not using the apiDataNames here to create a request body
  // for the purposes of maintainability and troubleshooting.
  const { data: apiData } = await axios.post(
    `${apiBaseUrl}/pull/`,
    {
      benthic_attributes: {
        last_revision: lastRevisionNumbersPulled?.benthic_attributes ?? null,
      },
      fish_families: {
        last_revision: lastRevisionNumbersPulled?.fish_families ?? null,
      },
      fish_genera: {
        last_revision: lastRevisionNumbersPulled?.fish_genera ?? null,
      },
      fish_species: {
        last_revision: lastRevisionNumbersPulled?.fish_species ?? null,
      },
      choices: { last_revision: lastRevisionNumbersPulled?.choices ?? null },
      projects: { last_revision: lastRevisionNumbersPulled?.projects ?? null },
    },
    {
      headers: {
        Authorization: `Bearer ${auth0Token}`,
      },
    },
  )

  await persistLastRevisionNumbersPulled({
    dexieInstance,
    apiData,
  })

  return dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.collect_records,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.projects,
    async () => {
      apiDataNames.forEach((apiDataType) => {
        if (apiDataType === 'choices') {
          // choices deletes property will always be empty, so we just ignore it
          // additionally the updates property is an object, not an array, so we just store it directly

          dexieInstance[apiDataType].put({
            id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
            choices: apiData[apiDataType]?.updates,
          })
        }
        if (apiDataType !== 'choices') {
          const updates = apiData[apiDataType]?.updates ?? []
          const deletes = apiData[apiDataType]?.deletes ?? []

          updates.forEach((specie) => {
            dexieInstance[apiDataType].put(specie)
          })
          deletes.deletes?.forEach(({ id }) => {
            dexieInstance[apiDataType].delete(id)
          })
        }
      })

      // for now we load some fake mock collect records here.
      // Later this will be triggered elsewhere
      // (see this ticket: https://trello.com/c/4uIfcdvr/274-wire-up-sync-triggers)
      mockMermaidData.collectRecords.forEach((record) => {
        dexieInstance.collect_records.put(record)
      })
    },
  )
}

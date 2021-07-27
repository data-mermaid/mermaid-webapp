import axios from 'axios'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import {
  getLastRevisionNumbersPulled,
  persistLastRevisionNumbersPulled,
} from './lastRevisionNumbers'
import { pullApiData } from './pullApiData'

export const initiallyHydrateOfflineStorageWithApiData = async ({
  dexieInstance,
  auth0Token,
  apiBaseUrl,
}) => {
  const apiDataNamesToPull = [
    'benthic_attributes',
    'choices',
    'fish_families',
    'fish_genera',
    'fish_species',
    'projects',
  ]

  await pullApiData({
    dexieInstance,
    auth0Token,
    apiBaseUrl,
    apiDataNamesToPull,
  })

  return dexieInstance.transaction(
    'rw',
    dexieInstance.collect_records,
    async () => {
      // for now we load some fake mock collect records here.
      // Later this will be triggered elsewhere
      // (see this ticket: https://trello.com/c/4uIfcdvr/274-wire-up-sync-triggers)
      mockMermaidData.collectRecords.forEach((record) => {
        dexieInstance.collect_records.put(record)
      })
    },
  )
}

/* eslint-disable no-unused-vars */
import { CSVLink } from 'react-csv'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'
import { IconDownload } from '../../../icons'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import language from '../../../../language'
import { getToastArguments } from '../../../../library/getToastArguments'
import useDocumentTitle from '../../../../library/useDocumentTitle'
import useIsMounted from '../../../../library/useIsMounted'

const ExportSitesToCsv = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [choices, setChoices] = useState({})

  const [sitesForMapMarkers, setSitesForMapMarkers] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

  useDocumentTitle(`${language.pages.siteTable.title} - ${language.title.mermaid}`)

  const _getSiteRecords = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getSiteRecordsForUIDisplay(projectId),
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
      ])

        .then(([sites, project, choicesResponse]) => {
          if (isMounted.current) {
            if (!project && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setSiteRecordsForUiDisplay(sites)
            setSitesForMapMarkers(sites)
            setChoices(choicesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isSyncInProgress, isMounted])

  const getTableCellData = useMemo(
    () =>
      siteRecordsForUiDisplay.map(({ id, uiLabels }) => ({
        name: uiLabels.name,
        reefType: uiLabels.reefType,
        reefZone: uiLabels.reefZone,
        exposure: uiLabels.exposure,
        id,
      })),
    [siteRecordsForUiDisplay],
  )

  const name = getTableCellData.map((obj) => {
    return obj.name
  })
  const reefType = getTableCellData.map((obj) => {
    return obj.reefType
  })

  const reefZone = getTableCellData.map((obj) => {
    return obj.reefZone
  })

  const exposure = getTableCellData.map((obj) => {
    return obj.exposure
  })

  const longitude = siteRecordsForUiDisplay.map((obj) => {
    return obj.location.coordinates[0]
  })

  const latitude = siteRecordsForUiDisplay.map((obj) => {
    return obj.location.coordinates[1]
  })
  const notes = siteRecordsForUiDisplay.map((obj) => {
    return obj.notes
  })
  const country = siteRecordsForUiDisplay.map((obj) => {
    return obj.country
  })

  const countryName = () => {
    const countriesName = []

    for (const [, value] of Object.entries(choices)) {
      for (const [, value2] of Object.entries(value)) {
        for (let i = 0; i < value2.length; i++) {
          // eslint-disable-next-line max-depth
          for (let j = 0; j < country.length; j++) {
            // eslint-disable-next-line max-depth
            if (value2[i].id === country[j]) {
              countriesName.push(value2[i].name)
            }
          }
        }
      }
    }

    return countriesName
  }

  const headers = [
    'Country',
    'Name',
    'Latitude',
    'Longitude',
    'Reef type',
    'Reef zone',
    'Reef exposure',
    'Notes',
  ]

  const data = [countryName(), name, latitude, longitude, reefType, reefZone, exposure, notes]

  const transposeData = data[0].map((_, colIndex) => data.map((row) => row[colIndex]))

  return (
    <CSVLink
      headers={headers}
      data={transposeData}
      filename="Export_sites.csv"
      style={{ margin: 0, textDecoration: 'none' }}
    >
      <IconDownload /> Export sites
    </CSVLink>
  )
}

export default ExportSitesToCsv

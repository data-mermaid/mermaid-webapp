import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'

import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import {
  reactTableNaturalSort,
} from '../../generic/Table/reactTableNaturalSort'
import language from '../../../language'
import PaginatedTable from '../../generic/Table/PaginatedTable'

const Sites = ({ databaseSwitchboardInstance }) => {
  const [siteRecordsForUiDisplay, setSiteRecordsForUiDisplay] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getSiteRecords = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getSiteRecordsForUIDisplay()
      .then((records) => {
        if (isMounted) {
          setSiteRecordsForUiDisplay(records)
          setIsLoading(false)
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordsUnavailable)
      })

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Site',
        accessor: 'site',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Reef Type',
        accessor: 'reefType',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Reef Zone',
        accessor: 'reefZone',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Exposure',
        accessor: 'exposure',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(() =>
    siteRecordsForUiDisplay.map(({ uiLabels }) => ({
      site: uiLabels.site,
      reefType: uiLabels.reefType,
      reefZone: uiLabels.reefZone,
      exposure: uiLabels.exposure,
    })),
  )

  return (
    <ContentPageLayout
      toolbar={<>Sub layout top bar</>}
      content={
        <PaginatedTable
          tableColumns={tableColumns}
          tableCellData={tableCellData}
        />
      }
      isLoading={isLoading}
    />
  )
}

Sites.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default Sites

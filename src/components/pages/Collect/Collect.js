import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'

import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import { H3 } from '../../generic/text'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodes,
  reactTableNaturalSortDates,
} from '../../generic/Table/reactTableNaturalSort'
import { RowSpaceBetween } from '../../generic/positioning'
import PaginatedTable from '../../generic/Table/PaginatedTable'
import AddSampleUnitButton from './AddSampleUnitButton'
import language from '../../../language'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'

const TopBar = () => (
  <>
    <H3>Collect Records</H3>
    <RowSpaceBetween>
      <div>Future filter</div> <AddSampleUnitButton />
    </RowSpaceBetween>
  </>
)

const Collect = ({ databaseSwitchboardInstance }) => {
  const [collectRecordsForUiDisplay, setCollectRecordsForUiDisplay] = useState(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  const _getCollectRecords = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getCollectRecordsForUIDisplay()
      .then((records) => {
        if (isMounted) {
          setCollectRecordsForUiDisplay(records)
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

  const currentProjectPath = useCurrentProjectPath()

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Method',
        accessor: 'method',
        sortType: reactTableNaturalSortReactNodes,
      },
      {
        Header: 'Site',
        accessor: 'site',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Management',
        accessor: 'management',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Unit #',
        accessor: 'sampleUnitNumber',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size',
        accessor: 'size',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Depth (m)',
        accessor: 'depth',
        align: 'right',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Sample Date',
        accessor: 'sampleDate',
        sortType: reactTableNaturalSortDates,
      },
      {
        Header: 'Observers',
        accessor: 'observers',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Status',
        accessor: 'status',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Synced',
        accessor: 'synced',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(
    () =>
      collectRecordsForUiDisplay.map(({ id, data, uiLabels }) => ({
        method: (
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
            {uiLabels.protocol}
          </Link>
        ),
        site: uiLabels.site,
        management: uiLabels.management,
        sampleUnitNumber: uiLabels.sampleUnitNumber,
        size: uiLabels.size,
        depth: uiLabels.depth,
        sampleDate: uiLabels.sampleDate,
        observers: uiLabels.observers,
        status: uiLabels.status,
        synced: 'wip',
      })),
    [collectRecordsForUiDisplay, currentProjectPath],
  )

  return (
    <ContentPageLayout
      toolbar={<TopBar />}
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

Collect.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default Collect

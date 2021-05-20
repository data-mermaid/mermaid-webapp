import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'

import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import { reactTableNaturalSort } from '../../generic/Table/reactTableNaturalSort'
import language from '../../../language'
import { IconCheck } from '../../icons'
import PaginatedTable from '../../generic/Table/PaginatedTable'

const ManagementRegimes = ({ databaseSwitchboardInstance }) => {
  const [
    managementRegimeRecordsForUiDisplay,
    setManagementRegimeRecordsForUiDisplay,
  ] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getManagementRegimeRecords = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getManagementRegimeRecordsForUiDisplay()
      .then((records) => {
        if (isMounted) {
          setManagementRegimeRecordsForUiDisplay(records)
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

  const getIconCheckLabel = (property) => property && <IconCheck />

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Year Est.',
        accessor: 'estYear',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Compliance',
        accessor: 'compliance',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Open Access',
        accessor: 'openAccess',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Access Restrictions',
        accessor: 'accessRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Periodic Closure',
        accessor: 'periodicClosure',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Size Limits',
        accessor: 'sizeLimits',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Gear Restrictions',
        accessor: 'gearRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Species Restrictions',
        accessor: 'speciesRestriction',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'No Take',
        accessor: 'noTake',
        sortType: reactTableNaturalSort,
      },
    ],
    [],
  )

  const tableCellData = useMemo(() =>
    managementRegimeRecordsForUiDisplay.map(({ uiLabels }) => ({
      name: uiLabels.name,
      estYear: uiLabels.estYear,
      compliance: uiLabels.compliance,
      openAccess: getIconCheckLabel(uiLabels.openAccess),
      accessRestriction: getIconCheckLabel(uiLabels.accessRestriction),
      periodicClosure: getIconCheckLabel(uiLabels.periodicClosure),
      sizeLimits: getIconCheckLabel(uiLabels.sizeLimits),
      gearRestriction: getIconCheckLabel(uiLabels.gearRestriction),
      speciesRestriction: getIconCheckLabel(uiLabels.speciesRestriction),
      noTake: getIconCheckLabel(uiLabels.noTake),
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

ManagementRegimes.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default ManagementRegimes

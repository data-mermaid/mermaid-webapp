import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StyledToolbarButtonWrapper } from '../../Gfcr/Gfcr.styles'
import { IconPlus } from '../../../../icons'
import {
  ButtonSecondary,
  ButtonThatLooksLikeLinkUnderlined,
  ToolbarButtonWrapper,
} from '../../../../generic/buttons'
import PageUnavailable from '../../../PageUnavailable'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import {
  TableContentToolbar,
  StyledTableContentWrapper,
  StyledTableAnchor,
} from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import IconCheckLabel from './IconCheckLabel'
import RevenueModal from '../modals/RevenueModal'
import formattedCurrencyAmount from '../../../../../library/formatCurrencyAmount'
import { useTranslation, Trans } from 'react-i18next'

const Revenues = ({ indicatorSet, setIndicatorSet, choices, setSelectedNavItem, displayHelp }) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [revenueBeingEdited, setRevenueBeingEdited] = useState()

  const revenues = useMemo(() => {
    return indicatorSet.finance_solutions.flatMap((fs) => fs.revenues)
  }, [indicatorSet.finance_solutions])

  const handleEditRevenue = useCallback(
    (id) => {
      const revenue = revenues.find((rev) => rev.id === id)
      setRevenueBeingEdited(revenue)
      setIsModalOpen(true)
    },
    [revenues],
  )

  const tableColumns = useMemo(
    () => [
      {
        field: 'finance_solution',
        headerName: 'Business / Finance Solution',
        flex: 1,
        renderCell: (params) => (
          <StyledTableAnchor onClick={() => handleEditRevenue(params.id)}>
            {params.value}
          </StyledTableAnchor>
        ),
      },
      { field: 'revenue_type', headerName: 'Revenue Type', width: 200 },
      {
        field: 'sustainable_revenue_stream',
        headerName: 'Sustainable Revenue Stream',
        width: 200,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => <IconCheckLabel isCheck={params.value} />,
      },
      {
        field: 'revenue_amount',
        headerName: 'Revenue Amount',
        width: 180,
        align: 'right',
        headerAlign: 'right',
      },
    ],
    [handleEditRevenue],
  )

  const tableCellData = useMemo(() => {
    if (!choices || !revenues) {
      return []
    }

    return revenues.map((revenue) => {
      const { id, finance_solution, revenue_type, sustainable_revenue_stream, revenue_amount } =
        revenue

      const revenueTypeName = choices.revenuetypes.data?.find((c) => c.id === revenue_type).name

      return {
        id,
        finance_solution: indicatorSet.finance_solutions.find((fs) => fs.id === finance_solution).name,
        revenue_type: revenueTypeName,
        sustainable_revenue_stream: !!sustainable_revenue_stream,
        revenue_amount: `${formattedCurrencyAmount(revenue_amount)}`,
      }
    })
  }, [choices, indicatorSet.finance_solutions, revenues])

  const handleGlobalFilterChange = (value) => setSearchText(value)

  const handleAddRevenue = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleRevenueModalDismiss = (resetForm) => {
    resetForm()
    setRevenueBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary
          onClick={(event) => handleAddRevenue(event)}
          disabled={!indicatorSet.finance_solutions.length}
        >
          <IconPlus /> {t('gfcr.forms.revenues.add')}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = revenues.length ? (
    <GfcrGenericTable
      rows={tableCellData}
      columns={tableColumns}
      filterModel={{ items: [], quickFilterValues: searchText ? [searchText] : [] }}
    />
  ) : (
    <PageUnavailable
      mainText={t('gfcr.forms.revenues.no_revenues')}
      subText={
        indicatorSet.finance_solutions.length ? (
          t('gfcr.forms.revenues.select_add_revenue')
        ) : (
          <Trans
            i18nKey="gfcr.forms.revenues.add_before_revenues"
            components={{
              financeSolutionLink: (
                <ButtonThatLooksLikeLinkUnderlined
                  type="button"
                  onClick={() => setSelectedNavItem('finance-solutions')}
                />
              ),
            }}
          />
        )
      }
    />
  )

  return (
    <>
      <TableContentToolbar>
        <ToolBarRow>
          <FilterSearchToolbar
            name={t('filters.by_revenue')}
            disabled={revenues.length === 0}
            globalSearchText={searchText}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <RevenueModal
        isOpen={isModalOpen}
        revenue={revenueBeingEdited}
        financeSolutions={indicatorSet.finance_solutions}
        choices={choices}
        onDismiss={handleRevenueModalDismiss}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        displayHelp={displayHelp}
      />
    </>
  )
}

Revenues.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default Revenues

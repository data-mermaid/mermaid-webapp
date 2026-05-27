import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StyledToolbarButtonWrapper } from '../../Gfcr/Gfcr.styles'
import { IconPlus } from '../../../../icons'
import {
  ButtonSecondary,
  ToolbarButtonWrapper,
  ButtonThatLooksLikeLinkUnderlined,
} from '../../../../generic/buttons'
import PageUnavailable from '../../../PageUnavailable'
import { useTranslation, Trans } from 'react-i18next'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import {
  TableContentToolbar,
  StyledTableContentWrapper,
  StyledTableAnchor,
} from './subPages.styles'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'
import InvestmentModal from '../modals/InvestmentModal'
import formattedCurrencyAmount from '../../../../../library/formatCurrencyAmount'

const Investments = ({
  indicatorSet,
  setIndicatorSet,
  choices,
  onSubmit,
  setSelectedNavItem,
  displayHelp,
}) => {
  const { t } = useTranslation()

  const businessFinanceSolutionHeaderText = t(
    'gfcr.forms.finance_solutions.business_finance_solution',
  )
  const investmentSourceHeaderText = t('gfcr.forms.investments.investment_source')
  const investmentTypeHeaderText = t('gfcr.forms.investments.investment_type')
  const investmentAmountHeaderText = t('gfcr.forms.investments.investment_amount')

  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [investmentBeingEdited, setInvestmentBeingEdited] = useState()

  const investments = useMemo(() => {
    return indicatorSet.finance_solutions.flatMap((fs) => fs.investment_sources)
  }, [indicatorSet.finance_solutions])

  const handleEditInvestment = useCallback(
    (id) => {
      const investment = investments.find((inv) => inv.id === id)
      setInvestmentBeingEdited(investment)
      setIsModalOpen(true)
    },
    [investments],
  )

  const tableColumns = useMemo(
    () => [
      {
        field: 'finance_solution',
        headerName: businessFinanceSolutionHeaderText,
        flex: 1,
        renderCell: (params) => (
          <StyledTableAnchor onClick={() => handleEditInvestment(params.id)}>
            {params.value}
          </StyledTableAnchor>
        ),
      },
      { field: 'investment_source', headerName: investmentSourceHeaderText, width: 200 },
      { field: 'investment_type', headerName: investmentTypeHeaderText, width: 200 },
      {
        field: 'investment_amount',
        headerName: investmentAmountHeaderText,
        width: 180,
        align: 'right',
        headerAlign: 'right',
      },
    ],
    [
      businessFinanceSolutionHeaderText,
      investmentSourceHeaderText,
      investmentTypeHeaderText,
      investmentAmountHeaderText,
      handleEditInvestment,
    ],
  )

  const tableCellData = useMemo(() => {
    if (!choices || !investments) {
      return []
    }

    return investments.map((investment) => {
      const { id, finance_solution, investment_source, investment_type, investment_amount } =
        investment

      const investmentSourceName = choices.investmentsources.data?.find(
        (c) => c.id === investment_source,
      ).name
      const investmentTypeName = choices.investmenttypes.data?.find(
        (c) => c.id === investment_type,
      )?.name

      return {
        id,
        finance_solution: indicatorSet.finance_solutions.find((fs) => fs.id === finance_solution).name,
        investment_source: investmentSourceName,
        investment_type: investmentTypeName,
        investment_amount: `${formattedCurrencyAmount(investment_amount)}`,
      }
    })
  }, [choices, indicatorSet, investments])

  const handleGlobalFilterChange = (value) => setSearchText(value)

  const handleAddInvestment = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleInvestmentModalDismiss = (resetForm) => {
    resetForm()
    setInvestmentBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary
          onClick={(event) => handleAddInvestment(event)}
          disabled={!indicatorSet.finance_solutions.length}
        >
          <IconPlus /> {t('gfcr.forms.investments.add')}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = investments.length ? (
    <GfcrGenericTable
      rows={tableCellData}
      columns={tableColumns}
      filterModel={{ items: [], quickFilterValues: searchText ? [searchText] : [] }}
    />
  ) : (
    <PageUnavailable
      mainText={t('gfcr.forms.investments.no_investments')}
      subText={
        indicatorSet.finance_solutions.length ? (
          t('gfcr.forms.investments.select_add_investment')
        ) : (
          <Trans
            i18nKey="gfcr.forms.investments.add_before_investments"
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
            name={t('filters.by_investment')}
            disabled={investments.length === 0}
            globalSearchText={searchText}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <InvestmentModal
        isOpen={isModalOpen}
        investment={investmentBeingEdited}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        financeSolutions={indicatorSet.finance_solutions}
        choices={choices}
        onDismiss={handleInvestmentModalDismiss}
        onSubmit={onSubmit}
        displayHelp={displayHelp}
      />
    </>
  )
}

Investments.propTypes = {
  indicatorSet: PropTypes.object,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setSelectedNavItem: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default Investments

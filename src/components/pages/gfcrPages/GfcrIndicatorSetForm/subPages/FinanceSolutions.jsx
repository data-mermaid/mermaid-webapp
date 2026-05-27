import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StyledToolbarButtonWrapper } from '../../Gfcr/Gfcr.styles'
import { IconPlus } from '../../../../icons'
import { ButtonSecondary, ToolbarButtonWrapper } from '../../../../generic/buttons'
import PageUnavailable from '../../../PageUnavailable'
import { useTranslation } from 'react-i18next'
import { ToolBarRow } from '../../../../generic/positioning'
import FilterSearchToolbar from '../../../../FilterSearchToolbar/FilterSearchToolbar'
import {
  TableContentToolbar,
  StyledTableContentWrapper,
  StyledTableAnchor,
} from './subPages.styles'
import FinanceSolutionModal from '../modals/FinanceSolutionModal'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import GfcrGenericTable from '../../GfcrGenericTable'

const MOCK_ROWS = [
  { id: 1,  name: 'Green Fins',                                                          type: 'Technical assistance facility (TAF)', sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 47, sustainable_finance_mechanisms: '',               notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 2,  name: 'Self-Financing Model for MPA for East Kalimantan (BLUD KKP3K KDPS)', type: 'Conservation trust fund (CTF)',        sector: '',                                                              geographical_coverage: 'Regional',    used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 23, sustainable_finance_mechanisms: '',               notes: '' },
  { id: 3,  name: 'Coral Reef Funding Facility',                                         type: 'Financial facility',                   sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '✓', gender_2x_criteria: '',  total_solutions_supported: 61, sustainable_finance_mechanisms: '',               notes: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 4,  name: 'Shrimp Hatchery in Berau',                                            type: 'Business solution',                    sector: 'Sustainable ocean production - aquaculture',                    geographical_coverage: '',            used_a_taf: 'Yes: GFCR-funded',   taf_name: 'Yes: GFCR-funded',   local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: '' },
  { id: 5,  name: 'Aquahub',                                                             type: 'Financial mechanism solution',         sector: '',                                                              geographical_coverage: '',            used_a_taf: 'Yes: non-GFCR-funded', taf_name: 'Yes: non-GFCR-funded', local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: 'Blue bonds',     notes: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
  { id: 6,  name: 'Blended Finance Structure',                                           type: 'Programmatic co-financing',            sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: '' },
  { id: 7,  name: 'Blue carbon - Pemba',                                                 type: 'Business solution',                    sector: 'Sustainable coastal development - ecotourism',                  geographical_coverage: '',            used_a_taf: 'Yes: GFCR-funded',   taf_name: 'Yes: GFCR-funded',   local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.' },
  { id: 8,  name: 'BlueWild Coral Safari - Pemba',                                       type: 'Conservation trust fund (CTF)',        sector: '',                                                              geographical_coverage: 'National',    used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 85, sustainable_finance_mechanisms: '',               notes: '' },
  { id: 9,  name: 'BlueWild Underwater Room',                                            type: 'Financial mechanism solution',         sector: '',                                                              geographical_coverage: '',            used_a_taf: 'Yes: non-GFCR-funded', taf_name: 'Yes: non-GFCR-funded', local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: 'Insurance products', notes: '' },
  { id: 10, name: 'Impact Loan Facility',                                                type: 'Technical assistance facility (TAF)', sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 34, sustainable_finance_mechanisms: '',               notes: 'Excepteur sint occaecat cupidatat non proident.' },
  { id: 11, name: 'Samaki Bluu',                                                         type: 'Financial facility',                   sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '✓', gender_2x_criteria: '',  total_solutions_supported: 12, sustainable_finance_mechanisms: '',               notes: '' },
  { id: 12, name: 'Sea Sensorium',                                                       type: 'Business solution',                    sector: 'Sustainable ocean production - fisheries',                      geographical_coverage: '',            used_a_taf: 'Yes: GFCR-funded',   taf_name: 'Yes: GFCR-funded',   local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 13, name: 'MPA Pecca',                                                           type: 'Programmatic co-financing',            sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 14, name: 'Aquahub Mangrove Crab - PHI',                                         type: 'Conservation trust fund (CTF)',        sector: '',                                                              geographical_coverage: 'Subnational', used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 76, sustainable_finance_mechanisms: '',               notes: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
  { id: 15, name: 'Blue Wild Mindoro Coral Safari',                                      type: 'Financial mechanism solution',         sector: '',                                                              geographical_coverage: '',            used_a_taf: 'Yes: GFCR-funded',   taf_name: 'Yes: GFCR-funded',   local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: 'MPA entry fees', notes: '' },
  { id: 16, name: 'Sea Sensorium',                                                       type: 'Technical assistance facility (TAF)', sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 55, sustainable_finance_mechanisms: '',               notes: '' },
  { id: 17, name: 'Blended Finance Structure',                                           type: 'Business solution',                    sector: 'Circular economy and pollution mitigation - waste management',  geographical_coverage: '',            used_a_taf: 'Yes: non-GFCR-funded', taf_name: 'Yes: non-GFCR-funded', local_enterprise: '✓', gender_2x_criteria: '✓', total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: '' },
  { id: 18, name: 'Aquahub Sea Cucumber',                                                type: 'Financial facility',                   sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '✓', gender_2x_criteria: '',  total_solutions_supported: 8,  sustainable_finance_mechanisms: '',               notes: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.' },
  { id: 19, name: 'Large MPA networks',                                                  type: 'Conservation trust fund (CTF)',        sector: '',                                                              geographical_coverage: 'Regional',    used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: 92, sustainable_finance_mechanisms: '',               notes: '' },
  { id: 20, name: 'Blue Carbon PHI',                                                     type: 'Programmatic co-financing',            sector: '',                                                              geographical_coverage: '',            used_a_taf: '',                    taf_name: '',                    local_enterprise: '',  gender_2x_criteria: '',  total_solutions_supported: '',  sustainable_finance_mechanisms: '',               notes: 'Excepteur sint occaecat cupidatat non proident.' },
]

const FinanceSolutions = ({ indicatorSet, setIndicatorSet, choices, displayHelp }) => {
  const { t } = useTranslation()

  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [financeSolutionBeingEdited, setFinanceSolutionBeingEdited] = useState()

  const handleEditFinanceSolution = (id) => {
    const financeSolution = indicatorSet.finance_solutions.find((fs) => fs.id === id)
    setFinanceSolutionBeingEdited(financeSolution)
    setIsModalOpen(true)
  }

  const tableColumns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        width: 280,
        renderCell: (params) => (
          <StyledTableAnchor onClick={() => handleEditFinanceSolution(params.id)}>
            {params.value}
          </StyledTableAnchor>
        ),
      },
      { field: 'type', headerName: 'Type', width: 250 },
      { field: 'sector', headerName: 'Sector', width: 320 },
      { field: 'geographical_coverage', headerName: 'Geographical coverage', width: 200 },
      { field: 'used_a_taf', headerName: 'Used a TAF (incubator)', width: 200 },
      { field: 'taf_name', headerName: 'If yes, name of TAF (incubator)', width: 270 },
      {
        field: 'local_enterprise',
        headerName: 'Local enterprise',
        width: 150,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'gender_2x_criteria',
        headerName: 'Gender 2X Criteria',
        width: 165,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'total_solutions_supported',
        headerName: 'Total number of solutions (businesses and financial mechanisms) supported by',
        width: 460,
        align: 'right',
        headerAlign: 'right',
      },
      { field: 'sustainable_finance_mechanisms', headerName: 'Sustainable finance mechanisms', width: 260 },
      { field: 'notes', headerName: 'Notes', width: 300 },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleGlobalFilterChange = (value) => setSearchText(value)

  const handleAddFinanceSolution = (event) => {
    event.preventDefault()
    setIsModalOpen(true)
  }

  const handleFinanceSolutionModalDismiss = (resetForm) => {
    resetForm()
    setFinanceSolutionBeingEdited()
    setIsModalOpen(false)
  }

  const toolbarButtons = (
    <>
      <StyledToolbarButtonWrapper>
        <ButtonSecondary onClick={(event) => handleAddFinanceSolution(event)}>
          <IconPlus /> {t('gfcr.forms.finance_solutions.add')}
        </ButtonSecondary>
      </StyledToolbarButtonWrapper>
    </>
  )

  const table = MOCK_ROWS.length ? (
    <GfcrGenericTable
      rows={MOCK_ROWS}
      columns={tableColumns}
      filterModel={{ items: [], quickFilterValues: searchText ? [searchText] : [] }}
    />
  ) : (
    <PageUnavailable
      mainText={t('gfcr.forms.finance_solutions.no_finance_solutions')}
      subText={t('gfcr.forms.finance_solutions.select_add_finance_solution')}
    />
  )

  return (
    <>
      <TableContentToolbar>
        <ToolBarRow>
          <FilterSearchToolbar
            name={t('filters.by_finance_solution')}
            disabled={MOCK_ROWS.length === 0}
            globalSearchText={searchText}
            handleGlobalFilterChange={handleGlobalFilterChange}
          />
          <ToolbarButtonWrapper>{toolbarButtons}</ToolbarButtonWrapper>
        </ToolBarRow>
      </TableContentToolbar>
      <StyledTableContentWrapper>{table}</StyledTableContentWrapper>
      <FinanceSolutionModal
        isOpen={isModalOpen}
        financeSolution={financeSolutionBeingEdited}
        indicatorSet={indicatorSet}
        setIndicatorSet={setIndicatorSet}
        choices={choices}
        onDismiss={handleFinanceSolutionModalDismiss}
        displayHelp={displayHelp}
      />
    </>
  )
}

FinanceSolutions.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  displayHelp: PropTypes.bool,
}

export default FinanceSolutions

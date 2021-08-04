import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { matchSorter } from 'match-sorter'
import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from 'react-table'
import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import {
  IconAccountConvert,
  IconAccountRemove,
  IconSave,
  IconPlus,
} from '../../icons'
import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
  TableNavigation,
} from '../../generic/Table/table'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import { Row, RowSpaceBetween } from '../../generic/positioning'
import theme from '../../../theme'
import language from '../../../language'
import useIsMounted from '../../../library/useIsMounted'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'

const inputStyles = css`
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`

const SearchEmailSectionWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`

const SearchEmailLabelWrapper = styled.label`
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  margin-right: 10px;
  > input {
    ${inputStyles}
    width: 100%;
  }
`

const ToolbarRowWrapper = styled(Row)`
  align-items: flex-end;
`

const AddUserButton = styled(ButtonSecondary)`
  margin-top: 20px;
`

const Users = () => {
  const { isOnline } = useOnlineStatus()

  const [observerProfiles, setObserverProfiles] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance
        .getProjectProfiles()
        .then((projectProfilesResponse) => {
          if (isMounted.current) {
            setObserverProfiles(projectProfilesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(`users error`)
        })
    }
  }, [databaseSwitchboardInstance, isMounted])

  const tableColumns = useMemo(() => {
    const getObserverRole = (name) =>
      observerProfiles.find((profile) => profile.profile_name === name).role

    const tableRadioCell = (rowValues, value) => {
      return (
        <label htmlFor={`observer-${rowValues.name}`}>
          <input
            type="radio"
            value={value}
            name={rowValues.name}
            id={`observer-${rowValues.name}`}
            checked={getObserverRole(rowValues.name) === value}
            onChange={(event) => {
              const observers = [...observerProfiles]

              const foundObserver = observers.find(
                (profile) => profile.profile_name === rowValues.name,
              )

              foundObserver.role = parseInt(event.target.value, 10)

              setObserverProfiles(observers)
            }}
          />
        </label>
      )
    }

    return [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Admin',
        Cell: ({ row: { values } }) => tableRadioCell(values, 90),
      },
      {
        Header: 'Collector',
        Cell: ({ row: { values } }) => tableRadioCell(values, 50),
      },
      {
        Header: 'Read-Only',
        Cell: ({ row: { values } }) => tableRadioCell(values, 10),
      },
      {
        Header: 'Active Sample Units',
        accessor: 'active',
      },
      {
        Header: 'Transfer Sample Units',
        Cell: () => (
          <ButtonSecondary type="button" onClick={() => {}}>
            <IconAccountConvert />
          </ButtonSecondary>
        ),
      },
      {
        Header: 'Remove From Projects',
        Cell: () => (
          <ButtonSecondary type="button" onClick={() => {}}>
            <IconAccountRemove />
          </ButtonSecondary>
        ),
      },
    ]
  }, [observerProfiles])

  const tableCellData = useMemo(
    () =>
      observerProfiles.map((observer) => {
        return {
          name: observer.profile_name,
          email: 'WIP',
          active: 'WIP',
        }
      }),
    [observerProfiles],
  )

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name', 'values.email']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms) {
      return rows
    }

    return queryTerms.reduce(
      (results, term) => matchSorter(results, term, { keys }),
      rows,
    )
  }, [])

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns: tableColumns,
      data: tableCellData,
      initialState: { pageSize: 10 },
      globalFilter: tableGlobalFilters,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => {
    setPageSize(Number(e.target.value))
  }

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isSorted={column.isSorted}
                    isSortedDescending={column.isSortedDesc}
                  >
                    {column.render('Header')}
                  </Th>
                ))}
              </Tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)

              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()} align={cell.column.align}>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </Table>
      </TableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageSizeOptions={[10, 50, 100]}
        />
        <PageSelector
          onPreviousClick={previousPage}
          previousDisabled={!canPreviousPage}
          onNextClick={nextPage}
          nextDisabled={!canNextPage}
          onGoToPage={gotoPage}
          currentPageIndex={pageIndex}
          pageCount={pageOptions.length}
        />
      </TableNavigation>
    </>
  )

  const content = isOnline ? <> {table}</> : <PageUnavailableOffline />

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={content}
      toolbar={
        <>
          <RowSpaceBetween>
            <H2>Users</H2>
            <ButtonSecondary>
              <IconSave />
              Save Changes
            </ButtonSecondary>
          </RowSpaceBetween>
          <ToolbarRowWrapper>
            <FilterSearchToolbar
              name={language.pages.userTable.filterToolbarText}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            <SearchEmailSectionWrapper>
              <SearchEmailLabelWrapper htmlFor="filter_projects">
                {language.pages.userTable.searchEmailToolbarText}
                <input
                  type="text"
                  id="search-emails"
                  value=""
                  onChange={() => {}}
                />
              </SearchEmailLabelWrapper>
              <AddUserButton>
                <IconPlus />
                Add User
              </AddUserButton>
            </SearchEmailSectionWrapper>
          </ToolbarRowWrapper>
        </>
      }
    />
  )
}

Users.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
}

Users.defaultProps = {
  row: undefined,
}

export default Users

import {
  usePagination,
  useSortBy,
  useGlobalFilter,
  useTable,
} from 'react-table'
import { matchSorter } from 'match-sorter'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { useCurrentUser } from '../../../App/mermaidData/useCurrentUser'

import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import { InputRow } from '../../generic/form'
import {
  IconAccount,
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
import NewUserModal from '../../NewUserModal'
import TransferSampleUnitsModal from '../../TransferSampleUnitsModal'
import { validateEmail } from '../../../library/strings/validateEmail'
import IdsNotFound from '../IdsNotFound/IdsNotFound'

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

const WarningBadgeWrapper = styled('div')`
  padding: 10px 0;
`

const WarningTextStyle = styled(InputRow)`
  grid-template-columns: 1fr;
  ${(props) =>
    props.validationType === 'warning' &&
    css`
      border-color: ${theme.color.warningColor};
      background: #f0e0b3;
    `}
`

const ProfileImage = styled.div`
  border: 1px solid #000;
  border-radius: 50%;
  ${(props) =>
    props.img &&
    css`
      background-image: url(${props.img});
      background-position: center center;
      background-size: 35px;
      margin-right: 5px;
    `}
  width: 35px;
  height: 35px;
`

const NameCellStyle = styled('div')`
  display: flex;
  width: 250px;
  align-items: center;
  svg {
    width: ${(props) => props.theme.typography.xLargeIconSize};
    height: ${(props) => props.theme.typography.xLargeIconSize};
  }
`

const Users = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUserProfileModalOpen, setIsNewUserProfileModalOpen] = useState(
    false,
  )
  const [isReadonlyUserWithActiveSampleUnits] = useState(false)
  const [
    isTransferSampleUnitsModalOpen,
    setIsTransferSampleUnitsModalOpen,
  ] = useState(false)
  const [newUserProfile, setNewUserProfile] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [userTransferFrom, setUserTransferFrom] = useState('')
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const currentUser = useCurrentUser({ databaseSwitchboardInstance })
  const isMounted = useIsMounted()

  const [userTransferTo, setUserTransferTo] = useState(currentUser)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId) {
      Promise.all([
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getProject(projectId),
      ])
        .then(([projectProfilesResponse, projectResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setObserverProfiles(projectProfilesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.userRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  const openTransferSampleUnitsModal = (name) => {
    setUserTransferFrom(name)
    setIsTransferSampleUnitsModalOpen(true)
  }
  const closeTransferSampleUnitsModal = () =>
    setIsTransferSampleUnitsModalOpen(false)

  const fetchProjectProfiles = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance
        .getProjectProfiles(projectId)
        .then((projectProfilesResponse) => {
          setObserverProfiles(projectProfilesResponse)
        })
    }
  }, [databaseSwitchboardInstance, projectId])

  const addNewUser = () => {
    databaseSwitchboardInstance.getUserProfile(newUserProfile).then((res) => {
      const doesUserHaveMermaidProfile = res.data.count === 0

      if (doesUserHaveMermaidProfile) {
        setIsNewUserProfileModalOpen(true)
      } else {
        databaseSwitchboardInstance
          .addUser(newUserProfile, projectId)
          .then(() => {
            fetchProjectProfiles()
            setNewUserProfile('')
            toast.success(language.success.newUserAdd)
          })
          .catch(() => {
            toast.error(language.error.duplicateNewUserAdd)
          })
      }
    })
  }

  const handleNewUserSubmit = () => {
    databaseSwitchboardInstance.addUser(newUserProfile, projectId).then(() => {
      fetchProjectProfiles()
      setNewUserProfile('')
      toast.success(language.success.newPendingUserAdd)
    })

    return Promise.resolve()
  }

  const openNewUserProfileModal = () => {
    if (newUserProfile === '') {
      toast.warning(language.error.emptyEmailAdd)
    } else if (validateEmail(newUserProfile)) {
      addNewUser()
    } else {
      toast.warning(language.error.invalidEmailAdd)
    }
  }

  const closeNewUserProfileModal = () => setIsNewUserProfileModalOpen(false)

  const tableColumns = useMemo(() => {
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
        accessor: 'admin',
      },
      {
        Header: 'Collector',
        accessor: 'collector',
      },
      {
        Header: 'Read-Only',
        accessor: 'readonly',
      },
      {
        Header: 'Active Sample Units',
        accessor: 'active',
      },
      {
        Header: 'Transfer Sample Units',
        accessor: 'transfer',
      },
      {
        Header: 'Remove From Projects',
        accessor: 'remove',
      },
    ]
  }, [])

  const tableCellData = useMemo(() => {
    const getObserverRole = (id) =>
      observerProfiles.find((profile) => profile.id === id).role

    const observerRoleRadioCell = (userId, value) => {
      return (
        <label htmlFor={`observer-${userId}`}>
          <input
            type="radio"
            value={value}
            name={userId}
            id={`observer-${userId}`}
            checked={getObserverRole(userId) === value}
            onChange={(event) => {
              const observers = [...observerProfiles]

              const foundObserver = observers.find(({ id }) => id === userId)

              foundObserver.role = parseInt(event.target.value, 10)

              setObserverProfiles(observers)
            }}
          />
        </label>
      )
    }

    return observerProfiles.map(
      ({
        id: userId,
        profile_name,
        email,
        picture,
        num_active_sample_units,
      }) => {
        return {
          name: (
            <NameCellStyle>
              {picture ? <ProfileImage img={picture} /> : <IconAccount />}{' '}
              {profile_name}
            </NameCellStyle>
          ),
          email,
          admin: observerRoleRadioCell(userId, 90),
          collector: observerRoleRadioCell(userId, 50),
          readonly: observerRoleRadioCell(userId, 10),
          active: num_active_sample_units,
          transfer: (
            <ButtonSecondary
              type="button"
              onClick={() => openTransferSampleUnitsModal(profile_name)}
            >
              <IconAccountConvert />
            </ButtonSecondary>
          ),
          remove: (
            <ButtonSecondary type="button" onClick={() => {}}>
              <IconAccountRemove />
            </ButtonSecondary>
          ),
        }
      },
    )
  }, [observerProfiles])

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.email']

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

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))

  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const handleNewUserProfileAdd = (event) =>
    setNewUserProfile(event.target.value)

  const handleTransferSampleUnitChange = (name) => setUserTransferTo(name)

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
      <NewUserModal
        isOpen={isNewUserProfileModalOpen}
        onDismiss={closeNewUserProfileModal}
        newUser={newUserProfile}
        onSubmit={handleNewUserSubmit}
      />
      <TransferSampleUnitsModal
        isOpen={isTransferSampleUnitsModalOpen}
        onDismiss={closeTransferSampleUnitsModal}
        userTransferTo={userTransferTo}
        userTransferFrom={userTransferFrom}
        userOptions={observerProfiles}
        handleTransferSampleUnitChange={handleTransferSampleUnitChange}
      />
    </>
  )

  const content = isAppOnline ? <>{table}</> : <PageUnavailableOffline />

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
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
                  value={newUserProfile}
                  onChange={handleNewUserProfileAdd}
                />
              </SearchEmailLabelWrapper>
              <AddUserButton onClick={openNewUserProfileModal}>
                <IconPlus />
                Add User
              </AddUserButton>
            </SearchEmailSectionWrapper>
          </ToolbarRowWrapper>
          {isReadonlyUserWithActiveSampleUnits && (
            <WarningBadgeWrapper>
              <WarningTextStyle validationType="warning">
                {language.pages.userTable.warningBadgeMessage}
              </WarningTextStyle>
            </WarningBadgeWrapper>
          )}
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

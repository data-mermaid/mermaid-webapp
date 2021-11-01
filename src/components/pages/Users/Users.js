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
import styled, { css } from 'styled-components/macro'

import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { H2 } from '../../generic/text'
import {
  IconAccount,
  IconAccountConvert,
  IconAccountRemove,
  IconSave,
  IconPlus,
} from '../../icons'
import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { currentUserPropType } from '../../../App/mermaidData/mermaidDataProptypes'
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
import { RowSpaceBetween } from '../../generic/positioning'
import InlineMessage from '../../generic/InlineMessage'
import theme from '../../../theme'
import language from '../../../language'
import useIsMounted from '../../../library/useIsMounted'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import NewUserModal from '../../NewUserModal'
import TransferSampleUnitsModal from '../../TransferSampleUnitsModal'
import RemoveUserModal from '../../RemoveUserModal'
import { validateEmail } from '../../../library/strings/validateEmail'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import { pluralize } from '../../../library/strings/pluralize'
import { getProfileNameOrEmailForPendingUser } from '../../../library/getProfileNameOrEmailForPendingUser'
import InputAndButton from '../../generic/InputAndButton/InputAndButton'

const ToolbarRowWrapper = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    grid-template-rows: 1fr 1fr;
    grid-template-columns: auto;
  `)}
`

const ProfileImage = styled.div`
  border-radius: 50%;
  ${(props) =>
    props.img &&
    css`
      background-image: url(${props.img});
      background-position: center center;
      background-size: ${props.theme.typography.xLargeIconSize};
    `}
    width: ${(props) => props.theme.typography.xLargeIconSize};
    height: ${(props) => props.theme.typography.xLargeIconSize};
`

const NameCellStyle = styled('div')`
  display: flex;
  white-space: nowrap;
  align-items: center;
  svg {
    width: ${(props) => props.theme.typography.xLargeIconSize};
    height: ${(props) => props.theme.typography.xLargeIconSize};
  }
`
const UserTableTd = styled(Td)`
  position: relative;
`
const TableRadioLabel = styled('label')`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  display: grid;
  place-items: center;
  &:hover {
    border: solid 1px ${theme.color.primaryColor};
  }
`

const Users = ({ currentUser }) => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReadonlyUserWithActiveSampleUnits] = useState(false)
  const [isNewUserProfileModalOpen, setIsNewUserProfileModalOpen] = useState(
    false,
  )
  const [
    isTransferSampleUnitsModalOpen,
    setIsTransferSampleUnitsModalOpen,
  ] = useState(false)
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false)
  const [newUserProfile, setNewUserProfile] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [fromUser, setFromUser] = useState({})
  const [toUserProfileId, setToUserProfileId] = useState(currentUser.id)
  const [userToBeRemoved, setUserToBeRemoved] = useState({})
  const [
    showRemoveUserWithActiveSampleUnitsWarning,
    setShowRemoveUserWithActiveSampleUnitsWarning,
  ] = useState(false)
  const [projectName, setProjectName] = useState('')
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

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
            setProjectName(projectResponse?.name)
            setObserverProfiles(projectProfilesResponse)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.userRecordsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId])

  const fetchProjectProfiles = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance
        .getProjectProfiles(projectId)
        .then((projectProfilesResponse) => {
          setObserverProfiles(projectProfilesResponse)
        })
        .catch(() => {
          toast.error(language.error.userRecordsUnavailable)
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

  const handleNewUserProfileAdd = (event) =>
    setNewUserProfile(event.target.value)

  const handleTransferSampleUnitChange = (userId) => {
    setToUserProfileId(userId)
  }

  const transferSampleUnits = () => {
    const fromUserProfileId = fromUser.profile

    databaseSwitchboardInstance
      .transferSampleUnits(projectId, fromUserProfileId, toUserProfileId)
      .then((resp) => {
        const sampleUnitMsg = pluralize(
          fromUser.num_active_sample_units,
          'sample unit',
          'sample units',
        )
        const numRecordTransferred = resp.num_collect_records_transferred

        fetchProjectProfiles()
        toast.success(`${numRecordTransferred} ${sampleUnitMsg} transferred`)
      })

    return Promise.resolve()
  }

  const openTransferSampleUnitsModal = (
    profile,
    profile_name,
    email,
    num_active_sample_units,
  ) => {
    setFromUser({ profile, profile_name, email, num_active_sample_units })
    setIsTransferSampleUnitsModalOpen(true)
    setShowRemoveUserWithActiveSampleUnitsWarning(false)
  }
  const closeTransferSampleUnitsModal = () => {
    setIsTransferSampleUnitsModalOpen(false)
    setShowRemoveUserWithActiveSampleUnitsWarning(false)
  }

  const openRemoveUserModal = (user) => {
    const { profile, profile_name, email, num_active_sample_units } = user

    if (num_active_sample_units === 0) {
      setIsRemoveUserModalOpen(true)
      setUserToBeRemoved(user)
    } else {
      setFromUser({ profile, profile_name, email, num_active_sample_units })
      setIsTransferSampleUnitsModalOpen(true)
      setShowRemoveUserWithActiveSampleUnitsWarning(true)
    }
  }
  const closeRemoveUserModal = () => {
    setIsRemoveUserModalOpen(false)
  }

  const removeUserProfile = () => {
    databaseSwitchboardInstance
      .removeUser(userToBeRemoved, projectId)
      .then(() => {
        fetchProjectProfiles()
        toast.success(`User removed`)
      })

    return Promise.resolve()
  }

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
        Header: 'Remove From Project',
        accessor: 'remove',
      },
    ]
  }, [])

  const tableCellData = useMemo(() => {
    const getObserverRole = (id) =>
      observerProfiles.find((profile) => profile.id === id).role

    const observerRoleRadioCell = (userId, value) => {
      return (
        <TableRadioLabel htmlFor={`observer-${userId}-${value}`}>
          <input
            type="radio"
            value={value}
            name={userId}
            id={`observer-${userId}-${value}`}
            checked={getObserverRole(userId) === value}
            onChange={(event) => {
              const observers = [...observerProfiles]

              const foundObserver = observers.find(({ id }) => id === userId)

              foundObserver.role = parseInt(event.target.value, 10)

              setObserverProfiles(observers)
            }}
          />
        </TableRadioLabel>
      )
    }

    return observerProfiles.map((userInfo) => {
      const {
        id: userId,
        profile_name,
        email,
        picture,
        num_active_sample_units,
        profile,
      } = userInfo

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
            disabled={num_active_sample_units === 0}
            onClick={() =>
              openTransferSampleUnitsModal(
                profile,
                profile_name,
                email,
                num_active_sample_units,
              )
            }
          >
            <IconAccountConvert />
          </ButtonSecondary>
        ),
        remove: (
          <ButtonSecondary
            type="button"
            disabled={profile === currentUser.id}
            onClick={() => openRemoveUserModal(userInfo)}
          >
            <IconAccountRemove />
          </ButtonSecondary>
        ),
      }
    })
  }, [observerProfiles, currentUser])

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
      initialState: { pageSize: 15 },
      globalFilter: tableGlobalFilters,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))
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
                      <UserTableTd
                        {...cell.getCellProps()}
                        align={cell.column.align}
                      >
                        {cell.render('Cell')}
                      </UserTableTd>
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
          pageSizeOptions={[15, 50, 100]}
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
        currentUserId={currentUser.id}
        fromUser={fromUser}
        userOptions={observerProfiles}
        showRemoveUserWithActiveSampleUnitsWarning={
          showRemoveUserWithActiveSampleUnitsWarning
        }
        handleTransferSampleUnitChange={handleTransferSampleUnitChange}
        onSubmit={transferSampleUnits}
      />
      <RemoveUserModal
        isOpen={isRemoveUserModalOpen}
        onDismiss={closeRemoveUserModal}
        onSubmit={removeUserProfile}
        userNameToBeRemoved={getProfileNameOrEmailForPendingUser(
          userToBeRemoved,
        )}
        projectName={projectName}
      />
    </>
  )

  const content = isAppOnline ? <>{table}</> : <PageUnavailableOffline />
  const toolbar = isAppOnline ? (
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
        <InputAndButton
          inputId="add-new-user-email"
          labelText={language.pages.userTable.searchEmailToolbarText}
          buttonChildren={
            <>
              <IconPlus />
              Add User
            </>
          }
          value={newUserProfile}
          onChange={handleNewUserProfileAdd}
          buttonOnClick={openNewUserProfileModal}
        />
      </ToolbarRowWrapper>
      {isReadonlyUserWithActiveSampleUnits && (
        <InlineMessage type="warning">
          {language.pages.userTable.warningReadOnlyUser}
        </InlineMessage>
      )}
    </>
  ) : (
    <H2>Users</H2>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isLoading={isLoading}
      content={content}
      toolbar={toolbar}
    />
  )
}

Users.propTypes = {
  currentUser: currentUserPropType.isRequired,
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

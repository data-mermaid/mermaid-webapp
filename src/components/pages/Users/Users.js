import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { matchSorter } from 'match-sorter'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { currentUserPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { getProfileNameOrEmailForPendingUser } from '../../../library/getProfileNameOrEmailForPendingUser'
import { H2 } from '../../generic/text'
import { hoverState, mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import {
  IconAccount,
  IconAccountConvert,
  IconAccountRemove,
  IconPlus,
  IconAlert,
} from '../../icons'
import { pluralize } from '../../../library/strings/pluralize'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { validateEmail } from '../../../library/strings/validateEmail'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InlineMessage from '../../generic/InlineMessage'
import InputAndButton from '../../generic/InputAndButton/InputAndButton'
import language from '../../../language'
import NewUserModal from '../../NewUserModal'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import PageUnavailableOffline from '../PageUnavailableOffline'
import RemoveUserModal from '../../RemoveUserModal'
import theme from '../../../theme'
import TransferSampleUnitsModal from '../../TransferSampleUnitsModal'
import useIsMounted from '../../../library/useIsMounted'

const ToolbarRowWrapper = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    grid-template-rows: 1fr 1fr;
    grid-template-columns: auto;
  `)}
`
const WarningInlineMessage = styled(InlineMessage)`
  margin: ${theme.spacing.medium} 0;
`
const ActiveSampleUnitsIconAlert = styled(IconAlert)`
  color: ${theme.color.textColor};
  margin: 0 ${theme.spacing.small};
`
const ProfileImage = styled('div')`
  border-radius: 50%;
  ${(props) =>
    props.img &&
    css`
      background-image: url(${props.img});
      background-position: center center;
      background-size: ${props.theme.typography.xLargeIconSize};
    `}
  width: ${theme.typography.xLargeIconSize};
  height: ${theme.typography.xLargeIconSize};
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
  ${hoverState(css`
    border: solid 1px ${theme.color.primaryColor};
  `)}
`

const getRoleLabel = (roleCode) => {
  if (roleCode === 90) {
    return 'Admin'
  }
  if (roleCode === 50) {
    return 'Collector'
  }
  if (roleCode === 10) {
    return 'Read-only'
  }

  return undefined
}
const getDoesUserHaveActiveSampleUnits = (profile) => profile.num_active_sample_units > 0
const getIsUserRoleReadOnly = (profile) => profile.role === 10

const Users = ({ currentUser }) => {
  const [
    showRemoveUserWithActiveSampleUnitsWarning,
    setShowRemoveUserWithActiveSampleUnitsWarning,
  ] = useState(false)
  const [fromUser, setFromUser] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUserProfileModalOpen, setIsNewUserProfileModalOpen] = useState(false)
  const [isReadonlyUserWithActiveSampleUnits, setIsReadonlyUserWithActiveSampleUnits] =
    useState(false)
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false)
  const [isTransferSampleUnitsModalOpen, setIsTransferSampleUnitsModalOpen] = useState(false)
  const [newUserProfile, setNewUserProfile] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [toUserProfileId, setToUserProfileId] = useState(currentUser.id)
  const [userToBeRemoved, setUserToBeRemoved] = useState({})
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

  const _setIsReadonlyUserWithActiveSampleUnits = useEffect(() => {
    setIsReadonlyUserWithActiveSampleUnits(false)
    observerProfiles.forEach((profile) => {
      const profileHasActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isProfileReadOnly = getIsUserRoleReadOnly(profile)

      if (profileHasActiveSampleUnits && isProfileReadOnly) {
        setIsReadonlyUserWithActiveSampleUnits(true)
      }
    })
  }, [observerProfiles])

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

  const handleNewUserProfileAdd = (event) => setNewUserProfile(event.target.value)

  const handleTransferSampleUnitChange = (projectProfileId) => {
    setToUserProfileId(projectProfileId)
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

  const openTransferSampleUnitsModal = (profile, profile_name, email, num_active_sample_units) => {
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
    databaseSwitchboardInstance.removeUser(userToBeRemoved, projectId).then(() => {
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
        align: 'right',
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

  const handleRoleChange = useCallback(
    ({ event, projectProfileId }) => {
      const roleCode = parseInt(event.target.value, 10)

      databaseSwitchboardInstance
        .editProjectProfileRole({
          profileId: projectProfileId,
          projectId,
          roleCode,
        })
        .then((editedProfile) => {
          const editedUserName = editedProfile.profile_name
          const editedUserRole = getRoleLabel(editedProfile.role)

          const updatedObserverProfiles = observerProfiles.map((observer) =>
            observer.id === editedProfile.id ? editedProfile : observer,
          )

          setObserverProfiles(updatedObserverProfiles)
          toast.success(
            language.success.getUserRoleChangeSuccessMessage({
              userName: editedUserName,
              role: editedUserRole,
            }),
          )
        })
        .catch(() => {
          const userToBeEdited = observerProfiles.find(({ id }) => id === projectProfileId)

          toast.error(language.error.getUserRoleChangeFailureMessage(userToBeEdited.profile_name))
          setIsLoading(false)
        })
    },
    [databaseSwitchboardInstance, observerProfiles, projectId],
  )

  const tableCellData = useMemo(() => {
    const getObserverRole = (id) => observerProfiles.find((profile) => profile.id === id).role

    return observerProfiles.map((profile) => {
      const {
        id: projectProfileId,
        profile_name,
        email,
        picture,
        num_active_sample_units,
        profile: userId,
      } = profile

      const doesUserHaveActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isUserRoleReadOnly = getIsUserRoleReadOnly(profile)
      const isCurrentUser = userId === currentUser.id
      const isActiveSampleUnitsWarningShowing = doesUserHaveActiveSampleUnits && isUserRoleReadOnly

      return {
        name: (
          <NameCellStyle>
            {picture ? <ProfileImage img={picture} /> : <IconAccount />} {profile_name}
          </NameCellStyle>
        ),
        email,
        admin: (
          <TableRadioLabel htmlFor={`admin-${projectProfileId}`}>
            <input
              type="radio"
              value={90}
              name={projectProfileId}
              id={`admin-${projectProfileId}`}
              checked={getObserverRole(projectProfileId) === 90}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser}
            />
          </TableRadioLabel>
        ),
        collector: (
          <TableRadioLabel htmlFor={`collector-${projectProfileId}`}>
            <input
              type="radio"
              value={50}
              name={projectProfileId}
              id={`collector-${projectProfileId}`}
              checked={getObserverRole(projectProfileId) === 50}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser}
            />
          </TableRadioLabel>
        ),
        readonly: (
          <TableRadioLabel htmlFor={`readonly-${projectProfileId}`}>
            <input
              type="radio"
              value={10}
              name={projectProfileId}
              id={`readonly-${projectProfileId}`}
              checked={getObserverRole(projectProfileId) === 10}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser}
            />
          </TableRadioLabel>
        ),
        active: (
          <>
            {isActiveSampleUnitsWarningShowing ? <ActiveSampleUnitsIconAlert /> : null}
            {num_active_sample_units}{' '}
          </>
        ),
        transfer: (
          <ButtonSecondary
            type="button"
            disabled={!doesUserHaveActiveSampleUnits}
            onClick={() =>
              openTransferSampleUnitsModal(userId, profile_name, email, num_active_sample_units)
            }
          >
            <IconAccountConvert />
          </ButtonSecondary>
        ),
        remove: (
          <ButtonSecondary
            type="button"
            disabled={isCurrentUser}
            onClick={() => openRemoveUserModal(profile)}
          >
            <IconAccountRemove />
          </ButtonSecondary>
        ),
      }
    })
  }, [observerProfiles, currentUser, handleRoleChange])

  const tableGlobalFilters = useCallback((rows, id, query) => {
    const keys = ['values.name.props.children', 'values.email']

    const queryTerms = splitSearchQueryStrings(query)

    if (!queryTerms) {
      return rows
    }

    return queryTerms.reduce((results, term) => matchSorter(results, term, { keys }), rows)
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
      autoResetSortBy: false,
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
                      <UserTableTd {...cell.getCellProps()} align={cell.column.align}>
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
        showRemoveUserWithActiveSampleUnitsWarning={showRemoveUserWithActiveSampleUnitsWarning}
        handleTransferSampleUnitChange={handleTransferSampleUnitChange}
        onSubmit={transferSampleUnits}
      />
      <RemoveUserModal
        isOpen={isRemoveUserModalOpen}
        onDismiss={closeRemoveUserModal}
        onSubmit={removeUserProfile}
        userNameToBeRemoved={getProfileNameOrEmailForPendingUser(userToBeRemoved)}
        projectName={projectName}
      />
    </>
  )

  const content = isAppOnline ? <>{table}</> : <PageUnavailableOffline />
  const toolbar = isAppOnline ? (
    <>
      <H2>Users</H2>
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
        <WarningInlineMessage type="warning">
          {language.pages.userTable.warningReadOnlyUser}
        </WarningInlineMessage>
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
    <ContentPageLayout isPageContentLoading={isLoading} content={content} toolbar={toolbar} />
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

import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components/macro'

import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { getProfileNameOrEmailForPendingUser } from '../../../library/getProfileNameOrEmailForPendingUser'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2 } from '../../generic/text'
import { hoverState, mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import {
  IconAccount,
  IconAccountConvert,
  IconAccountRemove,
  IconPlus,
  IconAlert,
} from '../../icons'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodesSecondChild,
} from '../../generic/Table/reactTableNaturalSort'
import { pluralize } from '../../../library/strings/pluralize'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import { Table, Tr, Th, Td, TableOverflowWrapper, TableNavigation } from '../../generic/Table/table'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { validateEmail } from '../../../library/strings/validateEmail'
import communicateGenericApiErrorsToUser from '../../../library/communicateGenericApiErrorsToUser'
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
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'

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
  margin-right: 1rem;
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
  return {
    10: 'Read-only',
    50: 'Collector',
    90: 'Admin',
  }[roleCode]
}

const getDoesUserHaveActiveSampleUnits = (profile) => profile.num_active_sample_units > 0
const getIsUserRoleReadOnly = (profile) => profile.role === 10

const Users = () => {
  const [
    showRemoveUserWithActiveSampleUnitsWarning,
    setShowRemoveUserWithActiveSampleUnitsWarning,
  ] = useState(false)
  const [fromUser, setFromUser] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSendEmailToNewUserPromptOpen, setIsSendEmailToNewUserPromptOpen] = useState(false)
  const [isReadonlyUserWithActiveSampleUnits, setIsReadonlyUserWithActiveSampleUnits] =
    useState(false)
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false)
  const [isTransferSampleUnitsModalOpen, setIsTransferSampleUnitsModalOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [userToBeRemoved, setUserToBeRemoved] = useState({})
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { isSyncInProgress } = useSyncStatus()
  const { projectId } = useParams()
  const currentUser = useCurrentUser()
  const isMounted = useIsMounted()
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  useDocumentTitle(`${language.pages.userTable.title} - ${language.title.mermaid}`)

  const [toUserProfileId, setToUserProfileId] = useState(currentUser.id)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      Promise.all([
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getProject(projectId),
      ])
        .then(([projectProfilesResponse, projectResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setProjectName(projectResponse?.name)
            setObserverProfiles(projectProfilesResponse)
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.userRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, projectId, isSyncInProgress, currentUser])

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
          toast.error(...getToastArguments(language.error.userRecordsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId])

  const addExistingUser = () =>
    databaseSwitchboardInstance
      .addUser(newUserEmail, projectId)
      .then(() => {
        fetchProjectProfiles()
        setNewUserEmail('')
        toast.success(...getToastArguments(language.success.newUserAdd))
      })
      .catch((error) => {
        communicateGenericApiErrorsToUser({
          error,
          callback: () => {
            if (error.response.status === 400) {
              toast.error(...getToastArguments(language.error.duplicateNewUserAdd))
            } else {
              toast.error(...getToastArguments(language.error.generic))
            }
          },
        })
      })

  const notifyUserIfEmailInvalid = () => {
    if (newUserEmail === '') {
      toast.warning(...getToastArguments(language.error.emptyEmailAdd))

      return false
    }
    if (!validateEmail(newUserEmail)) {
      toast.warning(...getToastArguments(language.error.invalidEmailAdd))

      return false
    }

    return true
  }

  const addUser = () => {
    const isEmailValid = notifyUserIfEmailInvalid()

    if (isEmailValid) {
      databaseSwitchboardInstance.getUserProfile(newUserEmail).then((res) => {
        const doesUserHaveMermaidProfile = res.data.count !== 0

        if (!doesUserHaveMermaidProfile) {
          // if the user doesnt have a profile already, the addUser function
          // (and the associated API endpoint) results in an email being sent,
          // hence why we ask for permission first
          setIsSendEmailToNewUserPromptOpen(true)
        } else {
          addExistingUser()
        }
      })
    }
  }
  const closeSendEmailToNewUserPrompt = () => setIsSendEmailToNewUserPromptOpen(false)

  const addNewUserAndSendEmail = () => {
    return databaseSwitchboardInstance
      .addUser(newUserEmail, projectId)
      .then(() => {
        fetchProjectProfiles()
        setNewUserEmail('')
        closeSendEmailToNewUserPrompt()
        toast.success(...getToastArguments(language.success.newPendingUserAdd))
      })
      .catch((error) => {
        communicateGenericApiErrorsToUser({
          error,
        })
      })
  }

  const handleNewUserEmailOnChange = (event) => setNewUserEmail(event.target.value)

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
        toast.success(...getToastArguments(`${numRecordTransferred} ${sampleUnitMsg} transferred`))
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
      toast.success(...getToastArguments(language.success.userRemoved))
    })

    return Promise.resolve()
  }

  const tableColumnsForAdmin = useMemo(() => {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodesSecondChild,
      },
      {
        Header: 'Email',
        accessor: 'email',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Admin',
        accessor: 'admin',
        disableSortBy: true,
      },
      {
        Header: 'Collector',
        accessor: 'collector',
        disableSortBy: true,
      },
      {
        Header: 'Read-Only',
        accessor: 'readonly',
        disableSortBy: true,
      },
      {
        Header: 'Active Sample Units',
        accessor: 'active',
        sortType: reactTableNaturalSortReactNodesSecondChild,
        align: 'right',
      },
      {
        Header: 'Transfer Sample Units',
        accessor: 'transfer',
        disableSortBy: true,
      },
      {
        Header: 'Remove From Project',
        accessor: 'remove',
        disableSortBy: true,
      },
    ]
  }, [])

  const tableColumnsForCollector = useMemo(() => {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: 'Role',
        accessor: 'role',
        sortType: reactTableNaturalSort,
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
            ...getToastArguments(
              language.success.getUserRoleChangeSuccessMessage({
                userName: editedUserName,
                role: editedUserRole,
              }),
            ),
          )
        })
        .catch(() => {
          const userToBeEdited = observerProfiles.find(({ id }) => id === projectProfileId)

          toast.error(
            ...getToastArguments(
              language.error.getUserRoleChangeFailureMessage(userToBeEdited.profile_name),
            ),
          )
          setIsLoading(false)
        })
    },
    [databaseSwitchboardInstance, observerProfiles, projectId],
  )

  const tableCellDataForAdmin = useMemo(() => {
    return observerProfiles.map((profile) => {
      const {
        id: projectProfileId,
        profile_name,
        email,
        picture,
        num_active_sample_units,
        role,
        profile: userId,
      } = profile

      const doesUserHaveActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isUserRoleReadOnly = getIsUserRoleReadOnly(profile)
      const isCurrentUser = userId === currentUser.id
      const isActiveSampleUnitsWarningShowing = doesUserHaveActiveSampleUnits && isUserRoleReadOnly

      return {
        name: (
          <NameCellStyle>
            {picture ? <ProfileImage img={picture} /> : <IconAccount />}
            {profile_name}
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
              checked={role === 90}
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
              checked={role === 50}
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
              checked={role === 10}
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
            {num_active_sample_units}
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

  const tableCellDataForCollector = useMemo(
    () =>
      observerProfiles.map((profile) => {
        const { profile_name, role } = profile

        return {
          name: profile_name,
          role: getRoleLabel(role),
        }
      }),
    [observerProfiles],
  )

  const tableDefaultPrefs = useMemo(() => {
    return {
      sortBy: [
        {
          id: 'name',
          desc: false,
        },
      ],
      globalFilter: '',
    }
  }, [])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: `${currentUser.id}-usersTable`,
    defaultValue: tableDefaultPrefs,
  })

  const tableGlobalFilters = useCallback(
    (rows, id, query) => {
      const keys = currentUserProfile.isAdmin
        ? ['values.name.props.children', 'values.email']
        : ['values.name', 'values.role']

      const queryTerms = splitSearchQueryStrings(query)

      if (!queryTerms || !queryTerms.length) {
        return rows
      }

      return getTableFilteredRows(rows, keys, queryTerms)
    },
    [currentUserProfile],
  )

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
    state: { pageIndex, pageSize, sortBy, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns: currentUserProfile.is_admin ? tableColumnsForAdmin : tableColumnsForCollector,
      data: currentUserProfile.is_admin ? tableCellDataForAdmin : tableCellDataForCollector,
      initialState: {
        pageSize: 15,
        sortBy: tableUserPrefs.sortBy,
        globalFilter: tableUserPrefs.globalFilter,
      },
      autoResetSortBy: false,
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleRowsNumberChange = (e) => setPageSize(Number(e.target.value))
  const handleGlobalFilterChange = (value) => setGlobalFilter(value)

  const _setSortByPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  const _setFilterPrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  const table = (
    <>
      <TableOverflowWrapper>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const isMultiSortColumn = headerGroup.headers.some(
                    (header) => header.sortedIndex > 0,
                  )

                  return (
                    <Th
                      {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                      isSortedDescending={column.isSortedDesc}
                      sortedIndex={column.sortedIndex}
                      isMultiSortColumn={isMultiSortColumn}
                      isSortingEnabled={!column.disableSortBy}
                    >
                      {column.render('Header')}
                    </Th>
                  )
                })}
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
        isOpen={isSendEmailToNewUserPromptOpen}
        onDismiss={closeSendEmailToNewUserPrompt}
        newUser={newUserEmail}
        onSubmit={addNewUserAndSendEmail}
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

  const content = isAppOnline ? table : <PageUnavailableOffline />
  const toolbar = isAppOnline ? (
    <>
      <H2>{language.pages.userTable.title}</H2>
      <ToolbarRowWrapper>
        <FilterSearchToolbar
          name={
            currentUserProfile.is_admin
              ? language.pages.userTable.filterToolbarTextForAdmin
              : language.pages.userTable.filterToolbarTextForCollector
          }
          handleGlobalFilterChange={handleGlobalFilterChange}
          value={tableUserPrefs.globalFilter}
        />
        {currentUserProfile.is_admin && (
          <InputAndButton
            inputId="add-new-user-email"
            labelText={language.pages.userTable.searchEmailToolbarText}
            buttonChildren={
              <>
                <IconPlus />
                Add User
              </>
            }
            value={newUserEmail}
            onChange={handleNewUserEmailOnChange}
            buttonOnClick={addUser}
          />
        )}
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
    <ContentPageLayout
      isPageContentLoading={isAppOnline ? isLoading : false}
      content={content}
      toolbar={toolbar}
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

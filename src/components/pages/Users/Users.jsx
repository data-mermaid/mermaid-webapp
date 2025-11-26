import { toast } from 'react-toastify'
import { usePagination, useSortBy, useGlobalFilter, useTable } from 'react-table'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ActiveSampleUnitsIconAlert,
  InfoParagraph,
  InlineStyle,
  NameCellStyle,
  TableRadioLabel,
  ToolbarRowWrapper,
  UserTableTd,
} from './Users.styles'
import { ButtonSecondary, ButtonCaution, IconButton, ButtonPrimary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { getProfileNameOrEmailForPendingUser } from '../../../library/getProfileNameOrEmailForPendingUser'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { IconAccountConvert, IconPlus, IconInfo, IconAccountRemove } from '../../icons'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodesSecondChild,
} from '../../generic/Table/reactTableNaturalSort'
import { pluralize } from '../../../library/strings/pluralize'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  Tr,
  Th,
  TableNavigation,
  StickyTableOverflowWrapper,
  GenericStickyTable,
} from '../../generic/Table/table'
import { P, H3 } from '../../generic/text'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { validateEmail } from '../../../library/strings/validateEmail'
import FilterSearchToolbar from '../../FilterSearchToolbar/FilterSearchToolbar'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InlineMessage from '../../generic/InlineMessage'
import InputAndButton from '../../generic/InputAndButton/InputAndButton'
import NewUserModal from '../../NewUserModal'
import PageSelector from '../../generic/Table/PageSelector'
import PageSizeSelector from '../../generic/Table/PageSizeSelector'
import PageUnavailable from '../PageUnavailable'
import RemoveUserModal from '../../RemoveUserModal'
import TransferSampleUnitsModal from '../../TransferSampleUnitsModal'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import usePersistUserTablePreferences from '../../generic/Table/usePersistUserTablePreferences'
import { userRole } from '../../../App/mermaidData/userRole'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import {
  getIsUserAdminForProject,
  getIsProjectProfileReadOnly,
} from '../../../App/currentUserProfileHelpers'
import { PENDING_USER_PROFILE_NAME, PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { LabelContainer } from '../../generic/form'
import ColumnHeaderToolTip from '../../ColumnHeaderToolTip/ColumnHeaderToolTip'
import UserRolesInfoModal from '../../UserRolesInfoModal'
import { UserIcon } from '../../UserIcon/UserIcon'

const getRoleLabel = (roleCode) => {
  return {
    10: 'Read-only',
    50: 'Collector',
    90: 'Admin',
  }[roleCode]
}

const getDoesUserHaveActiveSampleUnits = (profile) => profile.num_active_sample_units > 0

const Users = () => {
  const { t } = useTranslation()

  const adminTooltipText = t('users.roles.admin_description')
  const collectorTooltipText = t('users.roles.collector_description')
  const readOnlyTooltipText = t('users.roles.read_only_description')
  const adminHeaderText = t('users.roles.admin')
  const collectorHeaderText = t('users.roles.collector')
  const readOnlyHeaderText = t('users.roles.read_only')
  const userRecordsUnavailableText = t('users.user_records_unavailable')
  const transferUserButtonText = t('users.transfer_button')
  const noSampleUnitsText = t('users.no_sample_units')

  const [fromUser, setFromUser] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isTableUpdating, setIsTableUpdating] = useState(false)
  const [isReadonlyUserWithActiveSampleUnits, setIsReadonlyUserWithActiveSampleUnits] =
    useState(false)
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false)
  const [isSendEmailToNewUserPromptOpen, setIsSendEmailToNewUserPromptOpen] = useState(false)
  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)

  const [isTransferSampleUnitsModalOpen, setIsTransferSampleUnitsModalOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [
    showRemoveUserWithActiveSampleUnitsWarning,
    setShowRemoveUserWithActiveSampleUnitsWarning,
  ] = useState(false)
  const [userToBeRemoved, setUserToBeRemoved] = useState({})
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const { setIsSyncInProgress, isSyncInProgress } = useSyncStatus()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const isMounted = useIsMounted()
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)

  const handleHttpResponseError = useHttpResponseErrorHandler()

  useDocumentTitle(`${t('users.users')} - ${t('mermaid')}`)

  const [toUserProfileId, setToUserProfileId] = useState(currentUser.id)

  const [isUserRolesModalOpen, setIsUserRolesModalOpen] = useState(false)
  const openUserRolesModal = () => setIsUserRolesModalOpen(true)
  const closeUserRolesModal = () => setIsUserRolesModalOpen(false)

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsPageLoading(false)
    }
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
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
            setIsPageLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(userRecordsUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    handleHttpResponseError,
    isAppOnline,
    isMounted,
    isSyncInProgress,
    projectId,
    userRecordsUnavailableText,
  ])

  const _setIsReadonlyUserWithActiveSampleUnits = useEffect(() => {
    setIsReadonlyUserWithActiveSampleUnits(false)
    observerProfiles.forEach((profile) => {
      const userHasActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isUserRoleReadOnly = getIsProjectProfileReadOnly(profile)

      if (userHasActiveSampleUnits && isUserRoleReadOnly) {
        setIsReadonlyUserWithActiveSampleUnits(true)
      }
    })
  }, [observerProfiles])

  const fetchProjectProfiles = useCallback(() => {
    if (databaseSwitchboardInstance) {
      return databaseSwitchboardInstance
        .getProjectProfiles(projectId)
        .then((projectProfilesResponse) => {
          return setObserverProfiles(projectProfilesResponse)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(userRecordsUnavailableText))
            },
          })
        })
    }

    return Promise.reject(new Error('databaseSwitchboardInstance isnt defined'))
  }, [databaseSwitchboardInstance, projectId, handleHttpResponseError, userRecordsUnavailableText])

  const addExistingUser = () => {
    setIsTableUpdating(true)
    databaseSwitchboardInstance
      .addUser(newUserEmail, projectId)
      .then(() => {
        return fetchProjectProfiles()
      })
      .then(() => {
        setNewUserEmail('')
        setIsTableUpdating(false)
        toast.success(...getToastArguments(t('users.messages.new_user_added')))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.response.status === 400) {
              toast.error(...getToastArguments(t('users.messages.duplicate_user_error')))
            } else {
              toast.error(...getToastArguments(t('users.messages.something_went_wrong')))
            }
            setIsTableUpdating(false)
          },
        })
      })
  }

  const notifyUserIfEmailInvalid = () => {
    if (newUserEmail === '') {
      toast.warning(...getToastArguments(t('users.messages.enter_email')))

      return false
    }
    if (!validateEmail(newUserEmail)) {
      toast.warning(...getToastArguments(t('users.messages.invalid_email')))

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
    setIsTableUpdating(true)

    return databaseSwitchboardInstance
      .addUser(newUserEmail, projectId)
      .then(() => {
        return fetchProjectProfiles()
      })
      .then(() => {
        setNewUserEmail('')
        closeSendEmailToNewUserPrompt()
        setIsTableUpdating(false)
        toast.success(...getToastArguments(t('users.messages.pending_user_added')))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            setIsTableUpdating(false)
          },
        })
      })
  }

  const handleNewUserEmailOnChange = (event) => setNewUserEmail(event.target.value)

  const handleTransferSampleUnitChange = (projectProfileId) => {
    setToUserProfileId(projectProfileId)
  }

  const transferSampleUnits = () => {
    setIsSyncInProgress(true) // hack to get collect record count to update, also shows a loader

    const fromUserProfileId = fromUser.profile

    return databaseSwitchboardInstance
      .transferSampleUnits(projectId, fromUserProfileId, toUserProfileId)
      .then((transferSampleUnitsResponse) => {
        return fetchProjectProfiles().then(() => transferSampleUnitsResponse)
      })
      .then((transferSampleUnitsResponse) => {
        const sampleUnitMsg = pluralize(
          fromUser.num_active_sample_units,
          'sample unit',
          'sample units',
        )
        const numRecordTransferred = transferSampleUnitsResponse.num_collect_records_transferred

        toast.success(
          ...getToastArguments(
            t('users.messages.sample_units_transferred', {
              count: numRecordTransferred,
              units: sampleUnitMsg,
            }),
          ),
        )

        setIsSyncInProgress(false) // hack to get collect record count to update, also shows a loader
      })
      .catch((error) => {
        setIsSyncInProgress(false)
        handleHttpResponseError({
          error,
          callback: () =>
            toast.error(...getToastArguments(t('users.messages.failed_sample_units_transfer'))),
        })
      })
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
    setIsTableUpdating(true)

    databaseSwitchboardInstance
      .removeUser(userToBeRemoved, projectId)
      .then(() => {
        return fetchProjectProfiles()
      })
      .then(() => {
        setIsTableUpdating(false)
        toast.success(...getToastArguments(t('users.messages.user_removed')))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            setIsTableUpdating(false)
          },
        })
      })

    return Promise.resolve()
  }

  const _useOnClickOutsideOfInfoIcon = useEffect(() => {
    document.body.addEventListener('click', () => {
      if (isHelperTextShowing === true) {
        setIsHelperTextShowing(false)
      }
    })
  }, [isHelperTextShowing])

  const tableColumnsForAdmin = useMemo(() => {
    const handleInfoIconClick = (event, label) => {
      if (currentHelperTextLabel === label) {
        setIsHelperTextShowing(!isHelperTextShowing)
      } else {
        setIsHelperTextShowing(true)
        setCurrentHelperTextLabel(label)
      }

      event.stopPropagation()
    }

    return [
      {
        Header: t('name'),
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodesSecondChild,
      },
      {
        Header: t('email'),
        accessor: 'email',
        sortType: reactTableNaturalSort,
      },
      {
        Header: () => (
          <>
            <LabelContainer>
              {adminHeaderText}
              {isHelperTextShowing && currentHelperTextLabel === 'admin' ? (
                <ColumnHeaderToolTip helperText={adminTooltipText} left="-5em" top="-13.7em" />
              ) : null}
              <IconButton type="button" onClick={(event) => handleInfoIconClick(event, 'admin')}>
                <IconInfo aria-label={t('info')} />
              </IconButton>
            </LabelContainer>
          </>
        ),
        accessor: 'admin',
        disableSortBy: true,
      },
      {
        Header: () => (
          <>
            <LabelContainer>
              {collectorHeaderText}
              {isHelperTextShowing && currentHelperTextLabel === 'collector' ? (
                <ColumnHeaderToolTip
                  helperText={collectorTooltipText}
                  left="-2.5em"
                  top="-13.7em"
                />
              ) : null}
              <IconButton
                type="button"
                onClick={(event) => handleInfoIconClick(event, 'collector')}
              >
                <IconInfo aria-label={t('info')} />
              </IconButton>
            </LabelContainer>
          </>
        ),

        accessor: 'collector',
        disableSortBy: true,
      },
      {
        Header: () => (
          <>
            <LabelContainer>
              {readOnlyHeaderText}
              {isHelperTextShowing && currentHelperTextLabel === 'readOnly' ? (
                <ColumnHeaderToolTip helperText={readOnlyTooltipText} left="-2.5em" top="-7.7em" />
              ) : null}
              <IconButton type="button" onClick={(event) => handleInfoIconClick(event, 'readOnly')}>
                <IconInfo aria-label={t('info')} />
              </IconButton>
            </LabelContainer>
          </>
        ),
        accessor: 'readonly',
        disableSortBy: true,
      },
      {
        Header: t('users.unsubmitted_sample_units'),
        accessor: 'unsubmittedSampleUnits',
        disableSortBy: true,
        align: 'right',
      },
      {
        Header: t('users.remove_from_project'),
        accessor: 'remove',
        disableSortBy: true,
      },
    ]
  }, [
    isHelperTextShowing,
    currentHelperTextLabel,
    adminTooltipText,
    collectorTooltipText,
    readOnlyTooltipText,
    adminHeaderText,
    collectorHeaderText,
    readOnlyHeaderText,
    t,
  ])

  const tableColumnsForNonAdmin = useMemo(() => {
    return [
      {
        Header: t('name'),
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: t('users.role'),
        accessor: 'role',
        sortType: reactTableNaturalSort,
      },
    ]
  }, [t])

  const handleRoleChange = useCallback(
    ({ event, projectProfileId }) => {
      const roleCode = parseInt(event.target.value, 10)

      setIsTableUpdating(true)

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
              t('users.messages.role_changed_success', {
                userName: editedUserName,
                role: editedUserRole,
              }),
            ),
          )
          setIsTableUpdating(false)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              const userToBeEdited = observerProfiles.find(({ id }) => id === projectProfileId)

              toast.error(
                ...getToastArguments(
                  t('users.messages.role_changed_error', {
                    userName: userToBeEdited.profile_name,
                  }),
                ),
              )
            },
          })
          setIsTableUpdating(false)
        })
    },
    [databaseSwitchboardInstance, observerProfiles, projectId, handleHttpResponseError, t],
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
      const nameParts = (profile_name ?? '')
        .replace(PENDING_USER_PROFILE_NAME, 'pending user')
        .split(' ')
      const firstName = nameParts[0]
      const lastNameIndex = nameParts.length - 1
      const lastName = lastNameIndex === 0 ? undefined : nameParts[lastNameIndex]

      const userHasActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isUserRoleReadOnly = getIsProjectProfileReadOnly(profile)
      const isCurrentUser = userId === currentUser.id
      const isActiveSampleUnitsWarningShowing = userHasActiveSampleUnits && isUserRoleReadOnly

      const getCursorType = () => {
        if (isCurrentUser) {
          return 'not-allowed'
        }
        if (isTableUpdating) {
          return 'wait'
        }

        return 'pointer'
      }

      return {
        name: (
          <NameCellStyle>
            <UserIcon
              userImageUrl={picture}
              firstName={firstName}
              lastName={lastName}
              dark={true}
            />{' '}
            {profile_name}
          </NameCellStyle>
        ),
        email,
        admin: (
          <TableRadioLabel htmlFor={`admin-${projectProfileId}`} cursor={getCursorType()}>
            <input
              type="radio"
              value={userRole.admin}
              name={projectProfileId}
              id={`admin-${projectProfileId}`}
              checked={role === userRole.admin}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser || isTableUpdating}
            />
          </TableRadioLabel>
        ),
        collector: (
          <TableRadioLabel htmlFor={`collector-${projectProfileId}`} cursor={getCursorType()}>
            <input
              type="radio"
              value={userRole.collector}
              name={projectProfileId}
              id={`collector-${projectProfileId}`}
              checked={role === userRole.collector}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser || isTableUpdating}
            />
          </TableRadioLabel>
        ),
        readonly: (
          <TableRadioLabel htmlFor={`readonly-${projectProfileId}`} cursor={getCursorType()}>
            <input
              type="radio"
              value={userRole.read_only}
              name={projectProfileId}
              id={`readonly-${projectProfileId}`}
              checked={role === userRole.read_only}
              onChange={(event) => {
                handleRoleChange({ event, projectProfileId })
              }}
              disabled={isCurrentUser || isTableUpdating}
            />
          </TableRadioLabel>
        ),
        unsubmittedSampleUnits: (
          <>
            {isActiveSampleUnitsWarningShowing ? <ActiveSampleUnitsIconAlert /> : null}
            {userHasActiveSampleUnits ? (
              <>
                {num_active_sample_units}{' '}
                <ButtonSecondary
                  disabled={isTableUpdating}
                  type="button"
                  onClick={() =>
                    openTransferSampleUnitsModal(
                      userId,
                      profile_name,
                      email,
                      num_active_sample_units,
                    )
                  }
                >
                  <IconAccountConvert /> {transferUserButtonText}
                </ButtonSecondary>
              </>
            ) : (
              noSampleUnitsText
            )}
          </>
        ),
        remove: (
          <ButtonCaution
            type="button"
            disabled={isCurrentUser || isTableUpdating}
            onClick={() => openRemoveUserModal(profile)}
          >
            <IconAccountRemove />
          </ButtonCaution>
        ),
      }
    })
  }, [
    observerProfiles,
    currentUser,
    handleRoleChange,
    isTableUpdating,
    transferUserButtonText,
    noSampleUnitsText,
  ])

  const tableCellDataForNonAdmin = useMemo(
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
      const keys = isAdminUser
        ? ['values.name.props.children', 'values.email']
        : ['values.name', 'values.role']

      const queryTerms = splitSearchQueryStrings(query)

      if (!queryTerms || !queryTerms.length) {
        return rows
      }

      const tableFilteredRows = getTableFilteredRows(rows, keys, queryTerms)

      setSearchFilteredRowsLength(tableFilteredRows.length)

      return tableFilteredRows
    },
    [isAdminUser],
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
      columns: isAdminUser ? tableColumnsForAdmin : tableColumnsForNonAdmin,
      data: isAdminUser ? tableCellDataForAdmin : tableCellDataForNonAdmin,
      initialState: {
        pageSize: tableUserPrefs.pageSize ? tableUserPrefs.pageSize : PAGE_SIZE_DEFAULT,
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

  const _setPageSizePrefs = useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const table = (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()} cursor={isTableUpdating ? 'wait' : 'pointer'}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const headerProps = headerGroup.getHeaderGroupProps()

              return (
                <Tr {...headerProps} key={headerProps.key}>
                  {headerGroup.headers.map((column) => {
                    const isMultiSortColumn = headerGroup.headers.some(
                      (header) => header.sortedIndex > 0,
                    )

                    return (
                      <Th
                        {...column.getHeaderProps(getTableColumnHeaderProps(column))}
                        key={column.id}
                        isSortedDescending={column.isSortedDesc}
                        sortedIndex={column.sortedIndex}
                        isMultiSortColumn={isMultiSortColumn}
                        isSortingEnabled={!column.disableSortBy}
                        disabledHover={column.disableSortBy}
                      >
                        <span id="header-span">{column.render('Header')}</span>
                      </Th>
                    )
                  })}
                </Tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              const { key: _, ...restRowProps } = row.getRowProps()
              return (
                <Tr key={row.id} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: _, ...restCellProps } = cell.getCellProps()
                    const uniqueKey = `${row.id}-${cell.column.id}`
                    return (
                      <UserTableTd {...restCellProps} align={cell.column.align} key={uniqueKey}>
                        {cell.render('Cell')}
                      </UserTableTd>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </GenericStickyTable>
        <UserRolesInfoModal isOpen={isUserRolesModalOpen} onDismiss={closeUserRolesModal} />
      </StickyTableOverflowWrapper>
      <TableNavigation>
        <PageSizeSelector
          onChange={handleRowsNumberChange}
          pageSize={pageSize}
          pageType="user"
          pageSizeOptions={[15, 50, 100]}
          unfilteredRowLength={observerProfiles.length}
          searchFilteredRowLength={searchFilteredRowsLength}
          isSearchFilterEnabled={!!globalFilter?.length}
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
        isLoading={isTableUpdating}
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
        isLoading={isTableUpdating}
        onDismiss={closeRemoveUserModal}
        onSubmit={removeUserProfile}
        userNameToBeRemoved={getProfileNameOrEmailForPendingUser(userToBeRemoved)}
        projectName={projectName}
      />
    </>
  )

  const content = isAppOnline ? (
    table
  ) : (
    <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
  )
  const toolbar = (
    <>
      <H3>{t('users.users')}</H3>
      <InfoParagraph>
        <P>{t('users.introduction')}</P>
        <ButtonPrimary type="button" onClick={openUserRolesModal}>
          <IconInfo /> {t('users.learn_more_roles')}
        </ButtonPrimary>
      </InfoParagraph>
      {isAppOnline && (
        <>
          {isReadonlyUserWithActiveSampleUnits && isAdminUser && (
            <InlineStyle>
              <InlineMessage type="warning">
                <p>{t('users.warning_readonly_active_units')}</p>
              </InlineMessage>
            </InlineStyle>
          )}
          <ToolbarRowWrapper>
            <FilterSearchToolbar
              name={isAdminUser ? t('users.filter_by_name_email') : t('users.filter_by_name_role')}
              globalSearchText={globalFilter}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            {isAdminUser && (
              <InputAndButton
                inputId="add-new-user-email"
                labelText={t('users.add_user_email')}
                isLoading={isTableUpdating}
                buttonChildren={
                  <>
                    <IconPlus />
                    {t('users.add_user_button')}
                  </>
                }
                value={newUserEmail}
                onChange={handleNewUserEmailOnChange}
                buttonOnClick={addUser}
              />
            )}
          </ToolbarRowWrapper>
        </>
      )}
    </>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isPageLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout isPageContentLoading={isPageLoading} content={content} toolbar={toolbar} />
  )
}

export default Users

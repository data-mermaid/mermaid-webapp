import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { useParams } from 'react-router-dom'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { ButtonPrimary, ButtonSecondary, IconButton } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { getProfileNameOrEmailForPendingUser } from '../../../library/getProfileNameOrEmailForPendingUser'
import { getTableColumnHeaderProps } from '../../../library/getTableColumnHeaderProps'
import { getTableFilteredRows } from '../../../library/getTableFilteredRows'
import { getToastArguments } from '../../../library/getToastArguments'
import { IconAccountConvert, IconAccountRemove, IconInfo, IconPlus } from '../../icons'
import {
  reactTableNaturalSort,
  reactTableNaturalSortReactNodesSecondChild,
} from '../../generic/Table/reactTableNaturalSort'
import { splitSearchQueryStrings } from '../../../library/splitSearchQueryStrings'
import {
  GenericStickyTable,
  StickyTableOverflowWrapper,
  TableNavigation,
  Th,
  Tr,
} from '../../generic/Table/table'
import { H3, P } from '../../generic/text'
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
  getDisplayNameParts,
  getIsProjectProfileReadOnly,
  getIsUserAdminForProject,
} from '../../../App/currentUserProfileHelpers'
import { PAGE_SIZE_DEFAULT } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { LabelContainer } from '../../generic/form'
import ColumnHeaderToolTip from '../../ColumnHeaderToolTip/ColumnHeaderToolTip'
import UserRolesInfoModal from '../../UserRolesInfoModal'
import { UserIcon } from '../../UserIcon/UserIcon'
import { MuiTooltip } from '../../generic/MuiTooltip'
import buttonStyles from '../../../style/buttons.module.scss'

const getDoesUserHaveActiveSampleUnits = (profile) => profile.num_active_sample_units > 0

const Users = () => {
  const { t } = useTranslation()
  const roleLabels = useMemo(
    () => ({
      10: t('users.roles.read_only'),
      50: t('users.roles.collector'),
      90: t('users.roles.admin'),
    }),
    [t],
  )

  const userRecordsUnavailableText = t('users.user_records_unavailable')

  const [fromUser, setFromUser] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isTableUpdating, setIsTableUpdating] = useState(false)
  const [isReadonlyUserWithActiveSampleUnits, setIsReadonlyUserWithActiveSampleUnits] =
    useState(false)
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false)
  const [isSendEmailToNewUserPromptOpen, setIsSendEmailToNewUserPromptOpen] = useState(false)
  const [isTransferSampleUnitsModalOpen, setIsTransferSampleUnitsModalOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [observerProfiles, setObserverProfiles] = useState([])
  const [project, setProject] = useState({})
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
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  const handleHttpResponseError = useHttpResponseErrorHandler()

  useDocumentTitle(`${t('users.users')} - ${t('mermaid')}`)

  const [toUserProfileId, setToUserProfileId] = useState(currentUser.id)

  const [isUserRolesModalOpen, setIsUserRolesModalOpen] = useState(false)
  const openUserRolesModal = () => setIsUserRolesModalOpen(true)
  const closeUserRolesModal = () => setIsUserRolesModalOpen(false)

  // _getSupportingData
  useEffect(() => {
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
            setProject(projectResponse)
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

  // _setIsReadonlyUserWithActiveSampleUnits
  useEffect(() => {
    setIsReadonlyUserWithActiveSampleUnits(false)
    observerProfiles.forEach((profile) => {
      const userHasActiveSampleUnits = getDoesUserHaveActiveSampleUnits(profile)
      const isUserRoleReadOnly = getIsProjectProfileReadOnly(profile)

      if (userHasActiveSampleUnits && isUserRoleReadOnly) {
        setIsReadonlyUserWithActiveSampleUnits(true)
      }
    })
  }, [observerProfiles])

  const isDemoProject = project?.is_demo

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

  const handleGlobalFilterChange = (value) => setGlobalFilterValue(value)

  const handleTransferSampleUnitChange = (projectProfileId) => {
    setToUserProfileId(projectProfileId)
  }

  const transferSampleUnits = () => {
    setIsSyncInProgress(true) // hack to get collect record count to update, also shows a loader
    closeTransferSampleUnitsModal()

    const fromUserProfileId = fromUser.profile

    return databaseSwitchboardInstance
      .transferSampleUnits(projectId, fromUserProfileId, toUserProfileId)
      .then((transferSampleUnitsResponse) => {
        return fetchProjectProfiles().then(() => transferSampleUnitsResponse)
      })
      .then((transferSampleUnitsResponse) => {
        const numRecordTransferred = transferSampleUnitsResponse.num_collect_records_transferred

        toast.success(
          ...getToastArguments(
            t('users.messages.sample_units_transferred', {
              count: numRecordTransferred,
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
          const editedUserRole = roleLabels[editedProfile.role]

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
    [
      databaseSwitchboardInstance,
      observerProfiles,
      projectId,
      handleHttpResponseError,
      t,
      roleLabels,
    ],
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
                <p>{t('sample_units.warning_readonly_active_units')}</p>
              </InlineMessage>
            </InlineStyle>
          )}
          <ToolbarRowWrapper>
            <FilterSearchToolbar
              name={isAdminUser ? t('filters.by_name_email') : t('filters.by_name_role')}
              globalSearchText={globalFilterValue}
              handleGlobalFilterChange={handleGlobalFilterChange}
            />
            {isAdminUser && (
              <InputAndButton
                inputId="add-new-user-email"
                labelText={t('users.add_user_email')}
                isLoading={isTableUpdating}
                disabled={isDemoProject}
                buttonChildren={
                  isDemoProject ? (
                    <>
                      <MuiTooltip title={t('projects.demo.add_users_unavailable')}>
                        <IconPlus aria-label={t('buttons.add_user')} />
                        {t('buttons.add_user')}
                      </MuiTooltip>
                    </>
                  ) : (
                    <>
                      <IconPlus aria-label={t('buttons.add_user')} />
                      {t('buttons.add_user')}
                    </>
                  )
                }
                formValue={newUserEmail}
                onChange={handleNewUserEmailOnChange}
                buttonOnClick={addUser}
              />
            )}
          </ToolbarRowWrapper>
        </>
      )}
    </>
  )

  return (
    <>
      {idsNotAssociatedWithData.length ? (
        <ContentPageLayout
          isPageContentLoading={isPageLoading}
          content={<IdsNotFound ids={idsNotAssociatedWithData} />}
        />
      ) : (
        <ContentPageLayout
          isPageContentLoading={isPageLoading}
          content={
            isAppOnline ? (
              <UsersTableSection
                observerProfiles={observerProfiles}
                currentUser={currentUser}
                isAdminUser={isAdminUser}
                isTableUpdating={isTableUpdating}
                handleRoleChange={handleRoleChange}
                openTransferSampleUnitsModal={openTransferSampleUnitsModal}
                openRemoveUserModal={openRemoveUserModal}
                roleLabels={roleLabels}
                globalFilterValue={globalFilterValue}
                setGlobalFilterValue={setGlobalFilterValue}
                isDemoProject={isDemoProject}
              />
            ) : (
              <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
            )
          }
          toolbar={toolbar}
        />
      )}
      <NewUserModal
        isLoading={isTableUpdating}
        isOpen={isSendEmailToNewUserPromptOpen}
        onDismiss={closeSendEmailToNewUserPrompt}
        newUser={newUserEmail}
        onSubmit={addNewUserAndSendEmail}
      />
      {isTransferSampleUnitsModalOpen && (
        <TransferSampleUnitsModal
          isOpen={true}
          onDismiss={closeTransferSampleUnitsModal}
          currentUserId={currentUser.id}
          fromUser={fromUser}
          userOptions={observerProfiles}
          showRemoveUserWithActiveSampleUnitsWarning={showRemoveUserWithActiveSampleUnitsWarning}
          handleTransferSampleUnitChange={handleTransferSampleUnitChange}
          onSubmit={transferSampleUnits}
        />
      )}
      {isRemoveUserModalOpen && (
        <RemoveUserModal
          isOpen={true}
          isLoading={isTableUpdating}
          onDismiss={closeRemoveUserModal}
          onSubmit={removeUserProfile}
          userNameToBeRemoved={getProfileNameOrEmailForPendingUser(userToBeRemoved)}
          projectName={project.name}
        />
      )}
      <UserRolesInfoModal isOpen={isUserRolesModalOpen} onDismiss={closeUserRolesModal} />
    </>
  )
}

function UsersTableSection({
  observerProfiles,
  currentUser,
  isAdminUser,
  isTableUpdating,
  handleRoleChange,
  openTransferSampleUnitsModal,
  openRemoveUserModal,
  roleLabels,
  globalFilterValue,
  setGlobalFilterValue,
  isDemoProject,
}) {
  const { t } = useTranslation()

  const adminTooltipText = t('users.roles.admin_description')
  const collectorTooltipText = t('users.roles.collector_description')
  const readOnlyTooltipText = t('users.roles.read_only_description')
  const infoLabelText = t('message_type.info')
  const nameHeaderText = t('name')
  const emailHeaderText = t('email')
  const userRoleHeaderText = t('users.role')
  const unsubmittedSampleUnitsHeaderText = t('users.unsubmitted_sample_units')
  const removeFromProjectHeaderText = t('users.remove_from_project')
  const adminHeaderText = t('users.roles.admin')
  const collectorHeaderText = t('users.roles.collector')
  const readOnlyHeaderText = t('users.roles.read_only')

  const [isHelperTextShowing, setIsHelperTextShowing] = useState(false)
  const [currentHelperTextLabel, setCurrentHelperTextLabel] = useState(null)
  const [searchFilteredRowsLength, setSearchFilteredRowsLength] = useState(null)
  const [hasInitializedStoredFilter, setHasInitializedStoredFilter] = useState(false)

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

  const tablePrefsKey = useMemo(() => `${currentUser.id}-usersTable`, [currentUser.id])

  const [tableUserPrefs, handleSetTableUserPrefs] = usePersistUserTablePreferences({
    key: tablePrefsKey,
    defaultValue: tableDefaultPrefs,
  })

  // Clear the guard when the prefs key flips so a new user can load its saved filter.
  useEffect(() => {
    setHasInitializedStoredFilter(false)
  }, [tablePrefsKey])

  // Hydrate once per key to stop the FilterSearchToolbar loop and preserve active edits.
  useEffect(() => {
    if (hasInitializedStoredFilter) {
      return
    }

    const storedFilter =
      typeof tableUserPrefs?.globalFilter === 'string' ? tableUserPrefs.globalFilter : ''

    // Avoid overriding in-progress edits by hydrating stored prefs once per table key.
    setGlobalFilterValue(storedFilter)
    setHasInitializedStoredFilter(true)
  }, [tableUserPrefs?.globalFilter, setGlobalFilterValue, hasInitializedStoredFilter])

  useEffect(() => {
    const handleBodyClick = () => {
      if (isHelperTextShowing) {
        setIsHelperTextShowing(false)
      }
    }

    document.body.addEventListener('click', handleBodyClick)

    return () => {
      document.body.removeEventListener('click', handleBodyClick)
    }
  }, [isHelperTextShowing])

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
      const filteredRowLength = tableFilteredRows.length

      setSearchFilteredRowsLength((previousLength) =>
        previousLength === filteredRowLength ? previousLength : filteredRowLength,
      )

      return tableFilteredRows
    },
    [isAdminUser],
  )

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
        Header: nameHeaderText,
        accessor: 'name',
        sortType: reactTableNaturalSortReactNodesSecondChild,
      },
      {
        Header: emailHeaderText,
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
                <IconInfo aria-label={infoLabelText} />
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
                <IconInfo aria-label={infoLabelText} />
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
                <IconInfo aria-label={infoLabelText} />
              </IconButton>
            </LabelContainer>
          </>
        ),
        accessor: 'readonly',
        disableSortBy: true,
      },
      {
        Header: unsubmittedSampleUnitsHeaderText,
        accessor: 'unsubmittedSampleUnits',
        disableSortBy: true,
        align: 'right',
      },
      {
        Header: removeFromProjectHeaderText,
        accessor: 'remove',
        disableSortBy: true,
      },
    ]
  }, [
    adminHeaderText,
    adminTooltipText,
    collectorHeaderText,
    collectorTooltipText,
    infoLabelText,
    currentHelperTextLabel,
    isHelperTextShowing,
    nameHeaderText,
    emailHeaderText,
    readOnlyHeaderText,
    readOnlyTooltipText,
    removeFromProjectHeaderText,
    unsubmittedSampleUnitsHeaderText,
  ])

  const tableColumnsForNonAdmin = useMemo(() => {
    return [
      {
        Header: nameHeaderText,
        accessor: 'name',
        sortType: reactTableNaturalSort,
      },
      {
        Header: userRoleHeaderText,
        accessor: 'role',
        sortType: reactTableNaturalSort,
      },
    ]
  }, [nameHeaderText, userRoleHeaderText])

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
      const { displayName, firstName, lastName } = getDisplayNameParts(profile_name)
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

      const createRoleRadio = (roleValue, prefix) => (
        <TableRadioLabel htmlFor={`${prefix}-${projectProfileId}`} $cursor={getCursorType()}>
          <input
            type="radio"
            value={roleValue}
            name={projectProfileId}
            id={`${prefix}-${projectProfileId}`}
            checked={role === roleValue}
            onChange={(event) => {
              handleRoleChange({ event, projectProfileId })
            }}
            disabled={isCurrentUser || isTableUpdating}
          />
        </TableRadioLabel>
      )

      return {
        projectProfileId,
        name: (
          <NameCellStyle>
            <UserIcon
              userImageUrl={picture}
              firstName={firstName}
              lastName={lastName}
              dark={true}
            />{' '}
            {displayName}
          </NameCellStyle>
        ),
        email,
        admin: createRoleRadio(userRole.admin, 'admin'),
        collector: createRoleRadio(userRole.collector, 'collector'),
        readonly: createRoleRadio(userRole.read_only, 'readonly'),
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
                  <IconAccountConvert /> {t('buttons.transfer')}
                </ButtonSecondary>
              </>
            ) : (
              t('sample_units.none')
            )}
          </>
        ),
        remove: (
          <button
            className={buttonStyles['button--caution']}
            type="button"
            disabled={isCurrentUser || isTableUpdating || isDemoProject}
            onClick={() => openRemoveUserModal(profile)}
          >
            {isDemoProject ? (
              <MuiTooltip title={t('projects.demo.delete_users_unavailable')}>
                {' '}
                {/*' ' is a hack to make the tooltip populate on disabled state*/}
                <IconAccountRemove />
              </MuiTooltip>
            ) : (
              <IconAccountRemove />
            )}
          </button>
        ),
      }
    })
  }, [
    t,
    isDemoProject,
    observerProfiles,
    currentUser,
    handleRoleChange,
    isTableUpdating,
    openTransferSampleUnitsModal,
    openRemoveUserModal,
  ])

  const tableCellDataForNonAdmin = useMemo(
    () =>
      observerProfiles.map((profile) => {
        const { profile_name, role, id } = profile

        return {
          projectProfileId: id,
          name: profile_name,
          role: roleLabels[role],
        }
      }),
    [observerProfiles, roleLabels],
  )

  const activeTableColumns = isAdminUser ? tableColumnsForAdmin : tableColumnsForNonAdmin
  const activeTableData = isAdminUser ? tableCellDataForAdmin : tableCellDataForNonAdmin

  const tableInitialState = useMemo(() => {
    const initialPageSize =
      tableUserPrefs.pageSize && Number.isFinite(tableUserPrefs.pageSize)
        ? tableUserPrefs.pageSize
        : PAGE_SIZE_DEFAULT

    return {
      pageSize: initialPageSize,
      sortBy: tableUserPrefs.sortBy,
      globalFilter: tableUserPrefs.globalFilter,
    }
  }, [tableUserPrefs])

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
      columns: activeTableColumns,
      data: activeTableData,
      initialState: tableInitialState,
      autoResetSortBy: false,
      globalFilter: tableGlobalFilters,
      // Disables requirement to hold shift to enable multi-sort
      isMultiSortEvent: () => true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  useEffect(() => {
    const normalizedValue = globalFilterValue ?? ''

    if ((globalFilter ?? '') !== normalizedValue) {
      setGlobalFilter(normalizedValue)
    }
  }, [globalFilterValue, globalFilter, setGlobalFilter])

  useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'sortBy', currentValue: sortBy })
  }, [sortBy, handleSetTableUserPrefs])

  useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'globalFilter', currentValue: globalFilter })
  }, [globalFilter, handleSetTableUserPrefs])

  useEffect(() => {
    handleSetTableUserPrefs({ propertyKey: 'pageSize', currentValue: pageSize })
  }, [pageSize, handleSetTableUserPrefs])

  const handleRowsNumberChange = (event) => setPageSize(Number(event.target.value))

  return (
    <>
      <StickyTableOverflowWrapper>
        <GenericStickyTable {...getTableProps()} $cursor={isTableUpdating ? 'wait' : 'pointer'}>
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
                        $isSortedDescending={column.isSortedDesc}
                        $sortedIndex={column.sortedIndex}
                        $isMultiSortColumn={isMultiSortColumn}
                        $isSortingEnabled={!column.disableSortBy}
                        $disabledHover={column.disableSortBy}
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
                <Tr key={row.original.projectProfileId ?? row.id} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: _, ...restCellProps } = cell.getCellProps()
                    const uniqueKey = `${row.original.projectProfileId ?? row.id}-${cell.column.id}`
                    return (
                      <UserTableTd {...restCellProps} $align={cell.column.align} key={uniqueKey}>
                        {cell.render('Cell')}
                      </UserTableTd>
                    )
                  })}
                </Tr>
              )
            })}
          </tbody>
        </GenericStickyTable>
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
    </>
  )
}

const observerProfilePropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  profile_name: PropTypes.string,
  email: PropTypes.string,
  picture: PropTypes.string,
  num_active_sample_units: PropTypes.number,
  role: PropTypes.number,
  profile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
})

UsersTableSection.propTypes = {
  observerProfiles: PropTypes.arrayOf(observerProfilePropType).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  isAdminUser: PropTypes.bool.isRequired,
  isDemoProject: PropTypes.bool.isRequired,
  isTableUpdating: PropTypes.bool.isRequired,
  handleRoleChange: PropTypes.func.isRequired,
  openTransferSampleUnitsModal: PropTypes.func.isRequired,
  openRemoveUserModal: PropTypes.func.isRequired,
  roleLabels: PropTypes.objectOf(PropTypes.string).isRequired,
  globalFilterValue: PropTypes.string.isRequired,
  setGlobalFilterValue: PropTypes.func.isRequired,
}

export default Users

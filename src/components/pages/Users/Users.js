import { Formik } from 'formik'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { getProjectProfilesInitialValues } from './projectProfileInitialFormValues'
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
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
} from '../../generic/Table/table'
import { Row, RowSpaceBetween } from '../../generic/positioning'
import theme from '../../../theme'
import language from '../../../language'
import useIsMounted from '../../../library/useIsMounted'

const UsersTable = styled(Table)`
  td {
    position: relative;
    label {
      position: absolute;
      top: 0;
      left: 0;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
    }
  }
`

const ProfileNameCell = styled.div`
  display: flex;
  width: 200px;
  svg {
    margin-right: 10px;
  }
`

const inputStyles = css`
  padding: ${theme.spacing.small};
  ${mediaQueryPhoneOnly(css`
    padding: ${theme.spacing.xsmall};
  `)}
`

const FilterLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 10px;
  > input {
    ${inputStyles}
    width: 50%;
  }
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

  const initialFormValues = useMemo(
    () => getProjectProfilesInitialValues(observerProfiles),
    [observerProfiles],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const handleProfileRoleChange = (profiles, id, value) => {
    const foundObserver = profiles.find((profile) => profile.id === id)

    foundObserver.role = parseInt(value, 10)

    return profiles
  }

  const table = (
    <Formik {...formikOptions}>
      {(formik) => (
        <TableOverflowWrapper>
          <UsersTable>
            <thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Admin</Th>
                <Th>Collector</Th>
                <Th>Read-Only</Th>
                <Th>Active Sample Units</Th>
                <Th>Transfer Sample Units</Th>
                <Th>Remove From Projects</Th>
              </Tr>
            </thead>
            <tbody>
              {observerProfiles &&
                observerProfiles.map((observer) => (
                  <Tr key={observer.id}>
                    <Td>
                      <ProfileNameCell>
                        <IconAccount />
                        {observer.profile_name}
                      </ProfileNameCell>
                    </Td>
                    <Td>WIP</Td>
                    <Td>
                      <label htmlFor={`observer-${observer.profile_name}`}>
                        <input
                          type="radio"
                          value={90}
                          name={observer.profile_name}
                          id={`observer-${observer.profile_name}`}
                          checked={observer.role === 90}
                          onChange={(event) => {
                            const updatedProfile = handleProfileRoleChange(
                              formik.values.project_profiles,
                              observer.id,
                              event.target.value,
                            )

                            formik.setFieldValue(
                              'project_profiles',
                              updatedProfile,
                            )
                          }}
                        />
                      </label>{' '}
                    </Td>
                    <Td>
                      <label htmlFor={`observer-${observer.profile_name}`}>
                        <input
                          type="radio"
                          value={50}
                          name={observer.profile_name}
                          id={`observer-${observer.profile_name}`}
                          checked={observer.role === 50}
                          onChange={(event) => {
                            const updatedProfile = handleProfileRoleChange(
                              formik.values.project_profiles,
                              observer.id,
                              event.target.value,
                            )

                            formik.setFieldValue(
                              'project_profiles',
                              updatedProfile,
                            )
                          }}
                        />
                      </label>{' '}
                    </Td>
                    <Td>
                      <label htmlFor={`observer-${observer.profile_name}`}>
                        <input
                          type="radio"
                          value={10}
                          name={observer.profile_name}
                          id={`observer-${observer.profile_name}`}
                          checked={observer.role === 10}
                          onChange={(event) => {
                            const updatedProfile = handleProfileRoleChange(
                              formik.values.project_profiles,
                              observer.id,
                              event.target.value,
                            )

                            formik.setFieldValue(
                              'project_profiles',
                              updatedProfile,
                            )
                          }}
                        />
                      </label>{' '}
                    </Td>
                    <Td>WIP</Td>
                    <Td align="center">
                      <ButtonSecondary type="button">
                        <IconAccountConvert />
                      </ButtonSecondary>
                    </Td>
                    <Td align="center">
                      <ButtonSecondary type="button">
                        <IconAccountRemove />
                      </ButtonSecondary>
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </UsersTable>
        </TableOverflowWrapper>
      )}
    </Formik>
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
            <FilterLabelWrapper htmlFor="filter_projects">
              {language.pages.userTable.filterToolbarText}
              <input
                type="text"
                id="search-emails"
                value=""
                onChange={() => {}}
              />
            </FilterLabelWrapper>
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

export default Users

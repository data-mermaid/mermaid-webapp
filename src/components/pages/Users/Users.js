import { Formik } from 'formik'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo } from 'react'

import { getProjectProfilesInitialValues } from './projectProfileInitialFormValues'
import { H2 } from '../../generic/text'
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
import useIsMounted from '../../../library/useIsMounted'

const Users = () => {
  const { isOnline } = useOnlineStatus()

  const [choices, setChoices] = useState({})
  const [observerProfiles, setObserverProfiles] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(),
      ]

      Promise.all(promises)
        .then(([choicesResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            setChoices(choicesResponse)
            setObserverProfiles(projectProfilesResponse.results)
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

  const table = (
    <TableOverflowWrapper>
      <Table>
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
                <Td>{observer.profile_name}</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
                <Td>WIP</Td>
              </Tr>
            ))}
        </tbody>
      </Table>
    </TableOverflowWrapper>
  )

  const content = isOnline ? <> {table}</> : <PageUnavailableOffline />

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Users</H2>
        </>
      }
    />
  )
}

export default Users

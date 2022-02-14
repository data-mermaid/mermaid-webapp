import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Table, Tr, Th, Td, TableOverflowWrapper } from '../../generic/Table/table'
import { hoverState } from '../../../library/styling/mediaQueries'
import { ButtonPrimary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { getDataSharingOptions } from '../../../library/getDataSharingOptions'
import { getProjectInitialValues } from '../Admin/projectRecordInitialFormValue'
import { H2, P } from '../../generic/text'
import { IconInfo } from '../../icons'
import { MaxWidthInputWrapper } from '../../generic/form'
import { TooltipWithText } from '../../generic/tooltip'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import DataSharingInfoModal from '../../DataSharingInfoModal'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import PageUnavailableOffline from '../PageUnavailableOffline'
import theme from '../../../theme'
import useIsMounted from '../../../library/useIsMounted'

const DataSharingTable = styled(Table)`
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
      ${hoverState(css`
        border: solid 1px ${theme.color.primaryColor};
      `)}
    }
  }
`
const CheckBoxLabel = styled.label`
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`
const DataSharing = () => {
  const [dataPolicyOptions, setDataPolicyOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

  const [issDataSharingInfoModalOpen, setIsDataSharingInfoModalOpen] = useState(false)
  const openDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(true)
  const closeDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(false)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([projectResponse, choicesResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setProjectBeingEdited(projectResponse)
            setDataPolicyOptions(getDataSharingOptions(choicesResponse.datapolicies))
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isSyncInProgress])

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const findToolTipDescription = (policy) =>
    dataPolicyOptions.find(({ label }) => label === policy).description

  const handleBenthicPolicyChange = (event, form) => {
    const updatedValue = parseInt(event.target.value, 10)

    form.setFieldValue('data_policy_benthiclit', updatedValue)
    form.setFieldValue('data_policy_benthicpit', updatedValue)
    form.setFieldValue('data_policy_habitatcomplexity', updatedValue)
  }

  const content = isAppOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <>
          <MaxWidthInputWrapper>
            <h3>Data is much more powerful when shared.</h3>
            <P>{language.pages.dataSharing.introductionParagraph}</P>
            <ButtonPrimary type="button" onClick={openDataSharingInfoModal}>
              <IconInfo /> Learn more about how your data is shared...
            </ButtonPrimary>
            <TableOverflowWrapper>
              <DataSharingTable>
                <thead>
                  <Tr>
                    <Th>&nbsp;</Th>
                    <Th>
                      <TooltipWithText
                        tooltipText={findToolTipDescription('Private')}
                        text={<>Private</>}
                        id="private-tooltip"
                      />
                    </Th>
                    <Th>
                      <TooltipWithText
                        tooltipText={findToolTipDescription('Public Summary')}
                        text={<>Public Summary</>}
                        id="public-summary-tooltip"
                      />
                    </Th>
                    <Th>
                      <TooltipWithText
                        tooltipText={findToolTipDescription('Public')}
                        text={<>Public</>}
                        id="public-tooltip"
                      />
                    </Th>
                  </Tr>
                </thead>
                <tbody>
                  <Tr>
                    <Td>Fish Belt</Td>
                    {dataPolicyOptions.map((item) => (
                      <Td key={item.value}>
                        <label htmlFor={`fish-belt${item.value}`}>
                          <input
                            type="radio"
                            value={item.value}
                            name="fish-belt"
                            id={`fish-belt${item.value}`}
                            checked={
                              formik.getFieldProps('data_policy_beltfish').value === item.value
                            }
                            onChange={(event) => {
                              formik.setFieldValue(
                                'data_policy_beltfish',
                                parseInt(event.target.value, 10),
                              )
                            }}
                          />
                        </label>
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>Benthic: PIT, LIT, and Habitat Complexity</Td>
                    {dataPolicyOptions.map((item) => (
                      <Td key={item.value}>
                        <label htmlFor={`benthic${item.value}`}>
                          <input
                            type="radio"
                            value={item.value}
                            name="benthic"
                            id={`benthic${item.value}`}
                            checked={
                              formik.getFieldProps('data_policy_benthiclit').value === item.value
                            }
                            onChange={(event) => handleBenthicPolicyChange(event, formik)}
                          />
                        </label>
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>Bleaching</Td>
                    {dataPolicyOptions.map((item) => (
                      <Td key={item.value}>
                        <label htmlFor={`bleaching${item.value}`}>
                          <input
                            type="radio"
                            name="bleaching"
                            id={`bleaching${item.value}`}
                            value={item.value}
                            checked={
                              formik.getFieldProps('data_policy_bleachingqc').value === item.value
                            }
                            onChange={(event) => {
                              formik.setFieldValue(
                                'data_policy_bleachingqc',
                                parseInt(event.target.value, 10),
                              )
                            }}
                          />
                        </label>
                      </Td>
                    ))}
                  </Tr>
                </tbody>
              </DataSharingTable>
            </TableOverflowWrapper>
            <CheckBoxLabel>
              <input id="test-project-toggle" type="checkbox" /> This is a test project
            </CheckBoxLabel>
            <P>{language.pages.dataSharing.testProjectHelperText}</P>
            <DataSharingInfoModal
              isOpen={issDataSharingInfoModalOpen}
              onDismiss={closeDataSharingInfoModal}
            />
          </MaxWidthInputWrapper>
        </>
      )}
    </Formik>
  ) : (
    <PageUnavailableOffline />
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={content}
      toolbar={
        <>
          <H2>Data Sharing</H2>
        </>
      }
    />
  )
}

export default DataSharing

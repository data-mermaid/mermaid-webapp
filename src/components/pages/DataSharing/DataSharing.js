import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { Table, Tr, Th, Td, TableOverflowWrapper } from '../../generic/Table/table'
import { hoverState } from '../../../library/styling/mediaQueries'
import { ButtonPrimary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { currentUserPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { getDataSharingOptions } from '../../../library/getDataSharingOptions'
import { H2, H3, P } from '../../generic/text'
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

const getDataSharingPolicyLabel = (policyCode) => {
  return {
    10: 'Private',
    50: 'Public Summary',
    100: 'Public',
  }[policyCode]
}

const ReadOnlyDataSharingContent = ({ project }) => (
  <>
    <H3>Fish Belt</H3>
    <P>{getDataSharingPolicyLabel(project?.data_policy_beltfish)}</P>
    <H3>Benthic: PIT, LIT, and Habitat Complexity</H3>
    <P>{getDataSharingPolicyLabel(project?.data_policy_benthiclit)}</P>
    <H3>Bleaching</H3>
    <P>{getDataSharingPolicyLabel(project?.data_policy_bleachingqc)}</P>
  </>
)

const DataSharing = ({ currentUser }) => {
  const [dataPolicyOptions, setDataPolicyOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  const [issDataSharingInfoModalOpen, setIsDataSharingInfoModalOpen] = useState(false)
  const openDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(true)
  const closeDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(false)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ]

      Promise.all(promises)
        .then(([projectResponse, choicesResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setProjectBeingEdited(projectResponse)
            setDataPolicyOptions(getDataSharingOptions(choicesResponse.datapolicies))
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectsUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isSyncInProgress, currentUser])

  const getToastMessageForDataPolicyChange = (property, policy) => {
    switch (property) {
      case 'data_policy_beltfish':
        return language.success.getDataSharingPolicyChangeSuccess('Fish Belt', policy)
      case 'data_policy_benthiclit':
        return language.success.getDataSharingPolicyChangeSuccess(
          'Benthic: PIT, LIT, and Habitat Complexity',
          policy,
        )
      case 'data_policy_bleachingqc':
        return language.success.getDataSharingPolicyChangeSuccess('Bleaching', policy)
      default:
        return 'Project Saved'
    }
  }

  const handleSaveProject = useCallback(
    (editedValues, toastMessage) => {
      databaseSwitchboardInstance
        .saveProject({
          projectId,
          editedValues,
        })
        .then((updatedProject) => {
          setProjectBeingEdited(updatedProject)
          toast.success(...getToastArguments(toastMessage))
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectSave))
        })
    },
    [databaseSwitchboardInstance, projectId],
  )

  const handleDataPolicyChange = (event, propertyToUpdate) => {
    const policyCode = parseInt(event.target.value, 10)
    const editedValues = { ...projectBeingEdited }
    const toastMessage = getToastMessageForDataPolicyChange(propertyToUpdate, policyCode)

    if (propertyToUpdate === 'data_policy_benthiclit') {
      editedValues.data_policy_benthiclit = policyCode
      editedValues.data_policy_benthicpit = policyCode
      editedValues.data_policy_habitatcomplexity = policyCode
    } else {
      editedValues[propertyToUpdate] = policyCode
    }

    handleSaveProject(editedValues, toastMessage)
  }

  const handleTestProjectChange = (event) => {
    const isChecked = event.target.checked
    const status = isChecked ? language.projectCodes.status.test : language.projectCodes.status.open
    const editedValues = { ...projectBeingEdited, status }

    handleSaveProject(editedValues, language.success.projectStatusSaved)
  }

  const findToolTipDescription = (policy) =>
    dataPolicyOptions.find(({ label }) => label === policy)?.description || ''

  const isReadOnlyUser = !(currentUserProfile.is_admin || currentUserProfile.is_collector)
  const contentViewByRole = (
    <MaxWidthInputWrapper>
      <h3>Data is much more powerful when shared.</h3>
      <P>{language.pages.dataSharing.introductionParagraph}</P>
      <ButtonPrimary type="button" onClick={openDataSharingInfoModal}>
        <IconInfo /> Learn more about how your data is shared...
      </ButtonPrimary>
      {currentUserProfile.is_admin ? (
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
                        checked={projectBeingEdited?.data_policy_beltfish === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_beltfish')}
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
                        checked={projectBeingEdited?.data_policy_benthiclit === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_benthiclit')}
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
                        checked={projectBeingEdited?.data_policy_bleachingqc === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_bleachingqc')}
                      />
                    </label>
                  </Td>
                ))}
              </Tr>
            </tbody>
          </DataSharingTable>
        </TableOverflowWrapper>
      ) : (
        <ReadOnlyDataSharingContent project={projectBeingEdited} />
      )}
      {currentUserProfile.is_admin && (
        <>
          <CheckBoxLabel>
            <input
              id="test-project-toggle"
              type="checkbox"
              checked={projectBeingEdited?.status === language.projectCodes.status.test}
              onChange={handleTestProjectChange}
            />{' '}
            This is a test project
          </CheckBoxLabel>
          <P>{language.pages.dataSharing.testProjectHelperText}</P>
        </>
      )}
      <DataSharingInfoModal
        isOpen={issDataSharingInfoModalOpen}
        onDismiss={closeDataSharingInfoModal}
      />
    </MaxWidthInputWrapper>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isAppOnline ? isLoading : false}
      showCollectingNav={!isReadOnlyUser}
      content={isAppOnline ? contentViewByRole : <PageUnavailableOffline />}
      toolbar={
        <ContentPageToolbarWrapper>
          <H2>Data Sharing</H2>
        </ContentPageToolbarWrapper>
      }
    />
  )
}

DataSharing.propTypes = {
  currentUser: currentUserPropType.isRequired,
}

ReadOnlyDataSharingContent.propTypes = {
  project: PropTypes.shape({
    data_policy_beltfish: PropTypes.number,
    data_policy_benthiclit: PropTypes.number,
    data_policy_bleachingqc: PropTypes.number,
  }),
}

ReadOnlyDataSharingContent.defaultProps = {
  project: {},
}

export default DataSharing

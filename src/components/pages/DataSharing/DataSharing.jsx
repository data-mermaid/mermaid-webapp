import { toast } from 'react-toastify'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'

import { Table, Tr, Th, Td, TableOverflowWrapper } from '../../generic/Table/table'
import { hoverState } from '../../../library/styling/mediaQueries'
import { ButtonPrimary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { getDataSharingOptions } from '../../../library/getDataSharingOptions'
import { H2, H3, P } from '../../generic/text'
import { IconInfo } from '../../icons'
import { MaxWidthInputWrapper } from '../../generic/form'
import { TooltipWithText } from '../../generic/tooltip'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import DataSharingInfoModal from '../../DataSharingInfoModal'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import { getToastArguments } from '../../../library/getToastArguments'
import { getDataSharingPolicyLabel } from '../../../library/getDataSharingPolicyLabel'
import PageUnavailable from '../PageUnavailable'
import theme from '../../../theme'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { getIsUserAdminForProject } from '../../../App/currentUserProfileHelpers'
import { PROJECT_CODES } from '../../../library/constants/constants'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { useCurrentProject } from '../../../App/CurrentProjectContext'
import textStyles from '../../../style/typography.module.scss'

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
  cursor: ${(props) => props.cursor};
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
  }
`

const Input = styled.input`
  cursor: ${(props) => props.cursor};
`

const Label = styled.label`
  cursor: ${(props) => props.cursor};
`

const ReadOnlyDataSharingContent = ({ project = {} }) => {
  const { t } = useTranslation()

  return (
    <>
      <H3>{t('protocol_titles.fishbelt')}</H3>
      <P>{getDataSharingPolicyLabel(project?.data_policy_beltfish)}</P>
      <H3>{t('benthic_pit_lit_habitat')}</H3>
      <P>{getDataSharingPolicyLabel(project?.data_policy_benthiclit)}</P>
      <H3>{t('protocol_titles.bleachingqc')}</H3>
      <P>{getDataSharingPolicyLabel(project?.data_policy_bleachingqc)}</P>
    </>
  )
}

const DataSharing = () => {
  const { t } = useTranslation()
  const [dataPolicyOptions, setDataPolicyOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const { currentUser } = useCurrentUser()
  const isMounted = useIsMounted()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const [isDataUpdating, setIsDataUpdating] = useState(false)
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentProject } = useCurrentProject()
  const isDemoProject = currentProject?.is_demo

  useDocumentTitle(`${t('data_sharing.data_sharing')} - ${t('mermaid')}`)

  const projectNotAvailableText = t('projects.errors.not_available')
  const projectNotSavedText = t('projects.errors.not_saved')

  const [isDataSharingInfoModalOpen, setIsDataSharingInfoModalOpen] = useState(false)
  const openDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(true)
  const closeDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(false)

  // _getSupportingData
  useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
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
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: toast.error(...getToastArguments(projectNotAvailableText)),
          })
        })
    }
  }, [
    isAppOnline,
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    handleHttpResponseError,
    projectNotAvailableText,
  ])

  const getToastMessageForDataPolicyChange = (property, policy) => {
    const getMessageKey = (methodKey, policyCode) => {
      const policyType =
        {
          [PROJECT_CODES.policy.private]: 'private',
          [PROJECT_CODES.policy.publicSummary]: 'public_summary',
          [PROJECT_CODES.policy.public]: 'public',
        }[policyCode] || 'public'

      return `data_sharing.success.${methodKey}_${policyType}`
    }

    switch (property) {
      case 'data_policy_beltfish':
        return t(getMessageKey('fish_belt', policy))
      case 'data_policy_benthiclit':
        return t(getMessageKey('benthic', policy))
      case 'data_policy_bleachingqc':
        return t(getMessageKey('bleaching', policy))
      default:
        return t('projects.success.project_saved')
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
          setIsDataUpdating(false)
          setProjectBeingEdited(updatedProject)
          toast.success(...getToastArguments(toastMessage))

          // hack to refresh page and show or hide the dashboard link depending on potentially changed test project status
          navigate(location.pathname)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: toast.error(...getToastArguments(projectNotSavedText)),
          })
        })
    },
    [
      databaseSwitchboardInstance,
      projectId,
      navigate,
      location.pathname,
      handleHttpResponseError,
      projectNotSavedText,
    ],
  )

  const handleDataPolicyChange = (event, propertyToUpdate) => {
    const policyCode = parseInt(event.target.value, 10)
    const editedValues = { ...projectBeingEdited }
    const toastMessage = getToastMessageForDataPolicyChange(propertyToUpdate, policyCode)

    setIsDataUpdating(true)

    if (propertyToUpdate === 'data_policy_benthiclit') {
      editedValues.data_policy_benthiclit = policyCode
      editedValues.data_policy_benthicpit = policyCode
      editedValues.data_policy_habitatcomplexity = policyCode
      editedValues.data_policy_benthicpqt = policyCode
    } else {
      editedValues[propertyToUpdate] = policyCode
    }

    handleSaveProject(editedValues, toastMessage)
  }

  const handleTestProjectChange = (event) => {
    setIsDataUpdating(true)
    const isChecked = event.target.checked
    const status = isChecked ? PROJECT_CODES.status.test : PROJECT_CODES.status.open
    const editedValues = { ...projectBeingEdited, status }

    handleSaveProject(editedValues, t('projects.success.test_project_status_saved'))
  }

  const findToolTipDescription = (policy) =>
    dataPolicyOptions.find(({ label }) => label === policy)?.description || ''

  const isTestProject = projectBeingEdited?.status === PROJECT_CODES.status.test
  const contentViewByRole = (
    <MaxWidthInputWrapper cursor={isDataUpdating ? 'wait' : 'auto'}>
      <h3>{t('data_sharing.more_powerful')}</h3>
      <P>{t('data_sharing.information')}</P>
      <ButtonPrimary type="button" onClick={openDataSharingInfoModal}>
        <IconInfo /> {t('data_sharing.learn_more')}
      </ButtonPrimary>
      {isAdminUser ? (
        <TableOverflowWrapper>
          <DataSharingTable>
            <thead>
              <Tr>
                <Th>&nbsp;</Th>
                <Th align="center">
                  <TooltipWithText
                    tooltipText={findToolTipDescription('Private')}
                    text={<>{t('data_sharing.private')}</>}
                    id="private-tooltip"
                  />
                </Th>
                <Th align="center">
                  <TooltipWithText
                    tooltipText={findToolTipDescription('Public Summary')}
                    text={<>{t('data_sharing.public_summary')}</>}
                    id="public-summary-tooltip"
                  />
                </Th>
                <Th align="center">
                  <TooltipWithText
                    tooltipText={findToolTipDescription('Public')}
                    text={<>{t('data_sharing.public')}</>}
                    id="public-tooltip"
                  />
                </Th>
              </Tr>
            </thead>
            <tbody>
              <Tr>
                <Td>{t('protocol_titles.fishbelt')}</Td>
                {dataPolicyOptions.map((item) => (
                  <Td key={item.value}>
                    <Label
                      htmlFor={`fish-belt${item.value}`}
                      cursor={isDataUpdating ? 'wait' : 'pointer'}
                    >
                      <Input
                        type="radio"
                        value={item.value}
                        name="fish-belt"
                        id={`fish-belt${item.value}`}
                        checked={projectBeingEdited?.data_policy_beltfish === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_beltfish')}
                        disabled={isDataUpdating}
                        cursor={isDataUpdating ? 'wait' : 'pointer'}
                      />
                    </Label>
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>{t('benthic_pit_lit_habitat')}</Td>
                {dataPolicyOptions.map((item) => (
                  <Td key={item.value}>
                    <Label
                      htmlFor={`benthic${item.value}`}
                      cursor={isDataUpdating ? 'wait' : 'pointer'}
                    >
                      <Input
                        type="radio"
                        value={item.value}
                        name="benthic"
                        id={`benthic${item.value}`}
                        checked={projectBeingEdited?.data_policy_benthiclit === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_benthiclit')}
                        disabled={isDataUpdating}
                        cursor={isDataUpdating ? 'wait' : 'pointer'}
                      />
                    </Label>
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>{t('protocol_titles.bleachingqc')}</Td>
                {dataPolicyOptions.map((item) => (
                  <Td key={item.value}>
                    <Label
                      htmlFor={`bleaching${item.value}`}
                      cursor={isDataUpdating ? 'wait' : 'pointer'}
                    >
                      <Input
                        type="radio"
                        name="bleaching"
                        id={`bleaching${item.value}`}
                        value={item.value}
                        checked={projectBeingEdited?.data_policy_bleachingqc === item.value}
                        onChange={(e) => handleDataPolicyChange(e, 'data_policy_bleachingqc')}
                        disabled={isDataUpdating}
                        cursor={isDataUpdating ? 'wait' : 'pointer'}
                      />
                    </Label>
                  </Td>
                ))}
              </Tr>
            </tbody>
          </DataSharingTable>
        </TableOverflowWrapper>
      ) : (
        <ReadOnlyDataSharingContent project={projectBeingEdited} />
      )}
      {isAdminUser && !isDemoProject && (
        <>
          <CheckBoxLabel cursor={isDataUpdating ? 'wait' : 'auto'}>
            <Input
              id="test-project-toggle"
              type="checkbox"
              checked={isTestProject}
              onChange={handleTestProjectChange}
              disabled={isDataUpdating}
              cursor={isDataUpdating ? 'wait' : 'pointer'}
            />{' '}
            {t('data_sharing.is_test_project')}
          </CheckBoxLabel>
          <P>{t('data_sharing.test_project_data')}</P>
        </>
      )}
      {!isAdminUser && isTestProject && !isDemoProject && (
        <p>{t('data_sharing.is_test_project')}</p>
      )}
      {isDemoProject && (
        <Trans
          i18nKey={'projects.demo.project_reporting'}
          components={{
            span: <span className={textStyles['italic']} />,
          }}
        />
      )}
      {isDataSharingInfoModalOpen && (
        <DataSharingInfoModal isOpen onDismiss={closeDataSharingInfoModal} />
      )}
    </MaxWidthInputWrapper>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={
        isAppOnline ? (
          contentViewByRole
        ) : (
          <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
        )
      }
      toolbar={
        <ContentPageToolbarWrapper>
          <H2>{t('data_sharing.data_sharing')}</H2>
        </ContentPageToolbarWrapper>
      }
    />
  )
}

ReadOnlyDataSharingContent.propTypes = {
  project: PropTypes.shape({
    data_policy_beltfish: PropTypes.number,
    data_policy_benthiclit: PropTypes.number,
    data_policy_bleachingqc: PropTypes.number,
  }),
}

export default DataSharing

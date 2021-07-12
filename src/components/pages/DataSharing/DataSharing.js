import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { getProjectInitialValues } from '../Admin/projectRecordInitialFormValue'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { ButtonPrimary } from '../../generic/buttons'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { InputWrapper } from '../../generic/form'
import {
  Table,
  Tr,
  Th,
  Td,
  TableOverflowWrapper,
} from '../../generic/Table/table'
import { getDataSharingOptions } from '../../../library/getDataSharingOptions'
import { IconInfo } from '../../icons'
import theme from '../../../theme'
import language from '../../../language'
import DataSharingInfoModal from '../../DataSharingInfoModal'

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

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    visibility: visible;
  }
`

const TooltipText = styled.span`
  visibility: hidden;
  background-color: ${theme.color.primaryColor};
  color: #fff;
  text-align: center;
  padding: 10px;
  position: absolute;
  display: block;
  z-index: 1;
  width: 330px;
  top: 30px;
  font-size: 15px;
`

const ContentWithTooltip = ({ children, tooltipText, ariaLabelledBy }) => {
  return (
    <Tooltip tabIndex="0" id={ariaLabelledBy}>
      {children}
      <TooltipText role="tooltip" aria-labelledby={ariaLabelledBy}>
        {tooltipText}
      </TooltipText>
    </Tooltip>
  )
}

const DataSharing = () => {
  const { isOnline } = useOnlineStatus()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [dataPolicyOptions, setDataPolicyOptions] = useState([])
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { projectId } = useParams()

  const [issDataSharingInfoModalOpen, setIsDataSharingInfoModalOpen] = useState(
    false,
  )
  const openDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(true)
  const closeDataSharingInfoModal = () => setIsDataSharingInfoModalOpen(false)

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getChoices(),
      ]

      Promise.all(promises)
        .then(([projectResponse, choicesResponse]) => {
          if (isMounted) {
            setProjectBeingEdited(projectResponse)
            setDataPolicyOptions(
              getDataSharingOptions(choicesResponse.datapolicies),
            )
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`project error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, projectId])

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

  const content = isOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <>
          <InputWrapper>
            <h3>Data is much more powerful when shared.</h3>
            <p>{language.pages.dataSharing.introductionParagraph}</p>
            <ButtonPrimary type="button" onClick={openDataSharingInfoModal}>
              <IconInfo /> Learn more about how your data is shared...
            </ButtonPrimary>
            <TableOverflowWrapper>
              <DataSharingTable>
                <thead>
                  <Tr>
                    <Th>&nbsp;</Th>
                    <Th>
                      <ContentWithTooltip
                        tooltipText={findToolTipDescription('Private')}
                        ariaLabelledBy="private-tooltip"
                      >
                        Private
                      </ContentWithTooltip>
                    </Th>
                    <Th>
                      <ContentWithTooltip
                        tooltipText={findToolTipDescription('Public Summary')}
                        ariaLabelledBy="public-summary-tooltip"
                      >
                        Public Summary
                      </ContentWithTooltip>
                    </Th>
                    <Th>
                      <ContentWithTooltip
                        tooltipText={findToolTipDescription('Public')}
                        ariaLabelledBy="public-tooltip"
                      >
                        Public
                      </ContentWithTooltip>
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
                              formik.getFieldProps('data_policy_beltfish')
                                .value === item.value
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
                              formik.getFieldProps('data_policy_benthiclit')
                                .value === item.value
                            }
                            onChange={(event) =>
                              handleBenthicPolicyChange(event, formik)
                            }
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
                              formik.getFieldProps('data_policy_bleachingqc')
                                .value === item.value
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
              <input id="test-project-toggle" type="checkbox" /> This is a test
              project
            </CheckBoxLabel>
            <div>{language.pages.dataSharing.testProjectHelperText}</div>
            <DataSharingInfoModal
              isOpen={issDataSharingInfoModalOpen}
              onDismiss={closeDataSharingInfoModal}
            />
          </InputWrapper>
        </>
      )}
    </Formik>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={content}
      toolbar={
        <>
          <H2>Data Sharing</H2>
        </>
      }
    />
  )
}

ContentWithTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  tooltipText: PropTypes.string.isRequired,
  ariaLabelledBy: PropTypes.string.isRequired,
}

export default DataSharing

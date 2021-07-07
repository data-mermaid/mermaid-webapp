import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { getProjectInitialValues } from '../Admin/projectRecordInitialFormValue'
import { H2, H4 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { ButtonPrimary } from '../../generic/buttons'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { InputWrapper } from '../../generic/form'
import { getDataSharingOptions } from '../../../library/getDataSharingOptions'
import { IconInfo } from '../../icons'
import theme from '../../../theme'
import language from '../../../language'

const TextStyleWrapper = styled.div`
  padding: 0 10px;
  border-left: 10px solid rgb(221, 220, 228);
  margin-bottom: 20px;
  margin-right: 20%;
`

const DataSelectGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-row-gap: 5px;
  margin: 20px 0;
  margin-right: 20%;
  border: 10px solid rgb(221, 220, 228);
`

const ItemGridStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(221, 220, 228);
  align-items: center;
  padding: 10px;
`

const InputItemGridStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const RowItemGridStyle = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
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

  const content = isOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <>
          <InputWrapper>
            <H4>Data is much more powerful when shared</H4>
            <TextStyleWrapper>
              {language.pages.dataSharing.introductionParagraph}
            </TextStyleWrapper>
            <ButtonPrimary type="button" onClick={() => {}}>
              <IconInfo /> Learn more about how your data is shared
            </ButtonPrimary>
            <DataSelectGridWrapper>
              <ItemGridStyle />
              <ItemGridStyle>
                <ContentWithTooltip
                  tooltipText={findToolTipDescription('Private')}
                  ariaLabelledBy="private-tooltip"
                >
                  Private
                </ContentWithTooltip>
              </ItemGridStyle>
              <ItemGridStyle>
                <ContentWithTooltip
                  tooltipText={findToolTipDescription('Public Summary')}
                  ariaLabelledBy="public-summary-tooltip"
                >
                  Public Summary
                </ContentWithTooltip>
              </ItemGridStyle>
              <ItemGridStyle>
                <ContentWithTooltip
                  tooltipText={findToolTipDescription('Public')}
                  ariaLabelledBy="public-tooltip"
                >
                  Public
                </ContentWithTooltip>
              </ItemGridStyle>
              <RowItemGridStyle>Fish Belt</RowItemGridStyle>
              {dataPolicyOptions.map((item) => (
                <InputItemGridStyle key={item.value}>
                  <input
                    type="radio"
                    value={item.value}
                    checked={
                      formik.getFieldProps('data_policy_beltfish').value ===
                      item.value
                    }
                    onChange={(e) => {
                      formik.setFieldValue(
                        'data_policy_beltfish',
                        parseInt(e.target.value, 10),
                      )
                    }}
                  />
                </InputItemGridStyle>
              ))}
              <RowItemGridStyle>
                Benthic: PIT, LIT, and Habitat Complexity
              </RowItemGridStyle>
              {dataPolicyOptions.map((item) => (
                <InputItemGridStyle key={item.value}>
                  <input
                    type="radio"
                    value={item.value}
                    checked={
                      formik.getFieldProps('data_policy_benthiclit').value ===
                      item.value
                    }
                    onChange={(e) => {
                      const updatedValue = parseInt(e.target.value, 10)

                      formik.setFieldValue(
                        'data_policy_benthiclit',
                        updatedValue,
                      )
                      formik.setFieldValue(
                        'data_policy_benthicpit',
                        updatedValue,
                      )
                      formik.setFieldValue(
                        'data_policy_habitatcomplexity',
                        updatedValue,
                      )
                    }}
                  />
                </InputItemGridStyle>
              ))}
              <RowItemGridStyle>Bleaching</RowItemGridStyle>
              {dataPolicyOptions.map((item) => (
                <InputItemGridStyle key={item.value}>
                  <input
                    type="radio"
                    value={item.value}
                    checked={
                      formik.getFieldProps('data_policy_bleachingqc').value ===
                      item.value
                    }
                    onChange={(e) => {
                      formik.setFieldValue(
                        'data_policy_bleachingqc',
                        parseInt(e.target.value, 10),
                      )
                    }}
                  />
                </InputItemGridStyle>
              ))}
            </DataSelectGridWrapper>
            <CheckBoxLabel>
              <input id="test-project-toggle" type="checkbox" /> This is a test
              project
            </CheckBoxLabel>
            <div>{language.pages.dataSharing.testProjectHelperText}</div>
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

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Slide, toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'

import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { getIndicatorSetFormInitialValues } from './indicatorSetFormInitialValues'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import SaveButton from '../../../generic/SaveButton'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import { useCurrentProject } from '../../../../App/CurrentProjectContext'
import GfcrIndicatorSetNav from '../GfcrIndicatorSetNav'
import GfcrIndicatorSetForm from '../GfcrIndicatorSetForm/GfcrIndicatorSetForm'
import IndicatorSetTitle from './IndicatorSetTitle'
import { GfcrPageUnavailablePadding } from '../Gfcr/Gfcr.styles'
import PageUnavailable from '../../PageUnavailable'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import { ButtonSecondary } from '../../../generic/buttons'
import { IconInfo } from '../../../icons'
import { Dl, Figure } from '../../../generic/miscellaneous'
import { P } from '../../../generic/text'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: right;
`

const HelpButton = styled(ButtonSecondary)`
  margin-right: 1rem;
`

const GfcrIndicatorSet = ({ newIndicatorSetType }) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()

  const indicatorSetTitleText = t('gfcr.indicator_set')
  const reportText = t('gfcr.report')
  const targetText = t('gfcr.target')
  const hideHelpText = t('gfcr.hide_help')
  const showHelpText = t('gfcr.show_help')
  const indicatorSetSaveSuccessText = t('gfcr.success.indicator_set_save')
  const indicatorSetSaveFailedText = t('gfcr.errors.indicator_set_save_failed')
  const indicatorSetsUnavailableText = t('gfcr.errors.indicator_sets_unavailable')
  const formErrorTitleText = t('gfcr.form_errors')

  const { indicatorSetId, projectId } = useParams()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { gfcrIndicatorSets, setGfcrIndicatorSets } = useCurrentProject()
  const [choices, setChoices] = useState()

  const [isLoading, setIsLoading] = useState(true)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [indicatorSetBeingEdited, setIndicatorSetBeingEdited] = useState()
  const [displayHelp, setDisplayHelp] = useState(false)

  const [selectedNavItem, setSelectedNavItem] = useState('report-title-and-year')
  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new indicator set is saved (and that triggers a navigation to its new page)
  const indicatorSetType = indicatorSetBeingEdited?.indicator_set_type || newIndicatorSetType
  const indicatorSetTypeName = indicatorSetType === 'report' ? reportText : targetText

  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

  useEffect(function closeToastsWhenLeavingPage() {
    return () => {
      toast.dismiss()
    }
  }, [])

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isMounted.current && databaseSwitchboardInstance && isAppOnline) {
      const promises = [
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getIndicatorSets(projectId),
      ]

      Promise.all(promises)
        .then(([choicesResponse, indicatorSetsResponse]) => {
          if (isMounted.current) {
            setChoices(choicesResponse)
            setGfcrIndicatorSets(indicatorSetsResponse)
          }

          setIsLoading(false)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(indicatorSetsUnavailableText))
            },
          })

          setIsLoading(false)
        })
    }

    if (newIndicatorSetType) {
      setIsLoading(false)
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    handleHttpResponseError,
    projectId,
    setGfcrIndicatorSets,
    isAppOnline,
    newIndicatorSetType,
    setChoices,
    indicatorSetsUnavailableText,
  ])

  const _setIndicatorSet = useEffect(() => {
    if (gfcrIndicatorSets) {
      const indicatorSet = gfcrIndicatorSets.find(
        (indicatorSet) => indicatorSet.id === indicatorSetId,
      )

      setIndicatorSetBeingEdited(indicatorSet)
    }
  }, [gfcrIndicatorSets, indicatorSetId])

  const initialFormValues = useMemo(() => {
    return getIndicatorSetFormInitialValues(indicatorSetBeingEdited)
  }, [indicatorSetBeingEdited])

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions, updateFromCalcValues = false) => {
      /* prettier-ignore */
      const formattedIndicatorSetForApi = {
        ...indicatorSetBeingEdited,
        ...formikValues,
        indicator_set_type: indicatorSetType,
      }

      setSaveButtonState(buttonGroupStates.saving)
      try {
        let response = await databaseSwitchboardInstance.saveIndicatorSet(
          projectId,
          formattedIndicatorSetForApi,
        )

        if (updateFromCalcValues) {
          // Do another PUT, using the calc values as the F4 values
          response = await databaseSwitchboardInstance.saveIndicatorSet(projectId, {
            ...response,
            f4_1: response.f4_1_calc || 0,
            f4_2: response.f4_2_calc || 0,
            f4_3: response.f4_3_calc || 0,
          })
        }

        setSaveButtonState(buttonGroupStates.saved)
        setIsFormDirty(false)
        formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

        setIndicatorSetBeingEdited(response)

        if (newIndicatorSetType) {
          navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/${response.id}`)
        }
        toast.success(...getToastArguments(indicatorSetSaveSuccessText))
      } catch (error) {
        setSaveButtonState(buttonGroupStates.unsaved)

        if (error && isAppOnline) {
          const questionErrors = Object.entries(error.response.data)

          const errorMarkup = (
            <>
              <P>{indicatorSetSaveFailedText}</P>
              <Figure>
                <figcaption>{formErrorTitleText} </figcaption>
                <Dl>
                  {questionErrors.map(([key, value]) => (
                    <div key={key}>
                      <dt>{key.replace('f', 'F ').replace('_', '.')}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </Dl>
              </Figure>
            </>
          )

          toast.dismiss()
          toast.error(errorMarkup, {
            transition: Slide,
            autoClose: questionErrors.length ? false : 5000,
          })

          handleHttpResponseError({
            error,
          })
        }
      }
    },
    [
      indicatorSetBeingEdited,
      indicatorSetType,
      databaseSwitchboardInstance,
      projectId,
      newIndicatorSetType,
      navigate,
      currentProjectPath,
      isAppOnline,
      handleHttpResponseError,
      indicatorSetSaveSuccessText,
      indicatorSetSaveFailedText,
      formErrorTitleText,
    ],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      const errors = {}

      if (!values.title) {
        errors.title = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (!values.report_date) {
        errors.report_date = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      return errors
    },
  })

  const _setSaveButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const _setIsFormDirty = useEffect(() => setIsFormDirty(!!formik.dirty), [formik.dirty])

  const contentViewByRole = isAdminUser ? (
    <div
      style={{
        display: 'flex',
      }}
    >
      <GfcrIndicatorSetNav
        selectedNavItem={selectedNavItem}
        setSelectedNavItem={setSelectedNavItem}
      />
      <div style={{ flex: 1 }}>
        {!!indicatorSetBeingEdited && (
          <GfcrIndicatorSetForm
            formik={formik}
            indicatorSet={indicatorSetBeingEdited}
            setIndicatorSet={setIndicatorSetBeingEdited}
            selectedNavItem={selectedNavItem}
            setSelectedNavItem={setSelectedNavItem}
            indicatorSetType={indicatorSetType}
            handleFormSubmit={handleFormSubmit}
            isNewIndicatorSet={!!newIndicatorSetType}
            choices={choices}
            displayHelp={displayHelp}
          />
        )}
      </div>
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={shouldPromptTrigger} />
    </div>
  ) : (
    <GfcrPageUnavailablePadding>
      <PageUnavailable mainText={t('page.admin_only')} />
    </GfcrPageUnavailablePadding>
  )

  const displayIdNotFoundErrorPage = !indicatorSetBeingEdited && !newIndicatorSetType && isAppOnline

  return displayIdNotFoundErrorPage ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={[indicatorSetId]} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{
        name: newIndicatorSetType
          ? indicatorSetTitleText
          : `${formik.values.title} ${formik.values.report_date}`,
      }}
      content={
        isAppOnline ? (
          contentViewByRole
        ) : (
          <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
        )
      }
      toolbar={
        <ContentPageToolbarWrapper>
          {isAppOnline ? (
            <>
              <IndicatorSetTitle
                indicatorSetTitle={formik.values.title}
                type={indicatorSetTypeName}
                reportingDate={new Date(formik.values.report_date)}
                isNew={!!newIndicatorSetType}
              />
              <ButtonContainer>
                <HelpButton to="" onClick={() => setDisplayHelp(!displayHelp)}>
                  <IconInfo /> {displayHelp ? hideHelpText : showHelpText}
                </HelpButton>
                <SaveButton
                  formId="gfcr-indicator-set-form"
                  saveButtonState={saveButtonState}
                  formHasErrors={!!Object.keys(formik.errors).length}
                  formDirty={isFormDirty}
                />
              </ButtonContainer>
            </>
          ) : (
            <h2>{indicatorSetTitleText}</h2>
          )}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

GfcrIndicatorSet.propTypes = {
  newIndicatorSetType: PropTypes.string,
}

export default GfcrIndicatorSet

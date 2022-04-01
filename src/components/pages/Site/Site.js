import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Table, Tr, Td } from '../../generic/Table/table'

import { ContentPageLayout } from '../../Layout'
import { currentUserPropType, sitePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { inputOptionPropType } from '../../../library/miscPropTypes'
import { getOptions } from '../../../library/getOptions'
import { getSiteInitialValues } from './siteRecordFormInitialValues'
import { H2 } from '../../generic/text'
import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { InputRow, InputWrapper } from '../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputRadioWithLabelAndValidation from '../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import SingleSiteMap from '../../mermaidMap/SingleSiteMap'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useIsMounted from '../../../library/useIsMounted'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import SaveButton from '../../generic/SaveButton'
import LoadingModal from '../../LoadingModal/LoadingModal'

const TdKey = styled(Td)`
  white-space: nowrap;
  font-weight: 900;
  width: 0;
`

const TableRowItem = ({ title, options, value }) => {
  const rowItemValue = options ? options.find((option) => option.value === value).label : value

  return (
    <Tr>
      <TdKey>{title}</TdKey>
      <Td>{rowItemValue}</Td>
    </Tr>
  )
}

const ReadOnlySiteContent = ({
  site,
  countries,
  exposures,
  reefTypes,
  reefZones,
  isReadOnlyUser,
}) => {
  const { country, latitude, longitude, exposure, reef_type, reef_zone, notes } = site

  return (
    <>
      <Table>
        <tbody>
          <TableRowItem title="Country" options={countries} value={country} />
          <TableRowItem title="Latitude" value={latitude} />
          <TableRowItem title="Longitude" value={longitude} />
          <TableRowItem title="Exposure" options={exposures} value={exposure} />
          <TableRowItem title="Reef Type" options={reefTypes} value={reef_type} />
          <TableRowItem title="Reef Zone" options={reefZones} value={reef_zone} />
          <TableRowItem title="Notes" value={notes} />
        </tbody>
      </Table>
      <SingleSiteMap
        formLatitudeValue={latitude}
        formLongitudeValue={longitude}
        isReadOnlyUser={isReadOnlyUser}
      />
    </>
  )
}

const Site = ({ currentUser }) => {
  const [countryOptions, setCountryOptions] = useState([])
  const [exposureOptions, setExposureOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reefTypeOptions, setReefTypeOptions] = useState([])
  const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [siteBeingEdited, setSiteBeingEdited] = useState()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { siteId, projectId } = useParams()
  const isMounted = useIsMounted()
  const { isAppOnline } = useOnlineStatus()
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && siteId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSite(siteId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ]

      Promise.all(promises)
        .then(([siteResponse, choicesResponse, projectResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            if (!siteResponse && siteId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, siteId])
            }
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
            }
            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setCountryOptions(getOptions(choicesResponse.countries))
            setExposureOptions(getOptions(choicesResponse.reefexposures))
            setReefTypeOptions(getOptions(choicesResponse.reeftypes))
            setReefZoneOptions(getOptions(choicesResponse.reefzones))
            setSiteBeingEdited(siteResponse)
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteRecordUnavailable))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isSyncInProgress, projectId, siteId, currentUser])

  const initialFormValues = useMemo(() => getSiteInitialValues(siteBeingEdited), [siteBeingEdited])

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (formikValues, formikActions) => {
      const { country, exposure, name, latitude, longitude, notes, reef_type, reef_zone } =
        formikValues
      const formattedSiteForApi = {
        ...siteBeingEdited,
        country,
        exposure,
        name,
        notes,
        reef_type,
        reef_zone,
        location: {
          type: 'point',
          coordinates: [longitude, latitude],
        },
      }

      setSaveButtonState(buttonGroupStates.saving)
      databaseSwitchboardInstance
        .saveSite({ site: formattedSiteForApi, projectId })
        .then(() => {
          toast.success(...getToastArguments(language.success.siteSave))
          setSaveButtonState(buttonGroupStates.saved)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.siteSave))
        })
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.latitude) {
        errors.latitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.latitude > 90 || values.latitude < -90) {
        errors.latitude = [{ code: language.error.formValidation.latitude, id: 'Invalid Latitude' }]
      }

      if (!values.longitude) {
        errors.longitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.longitude > 180 || values.longitude < -180) {
        errors.longitude = [
          { code: language.error.formValidation.longitude, id: 'Invalid Longitude' },
        ]
      }

      return errors
    },
  })

  const { setFieldValue: formikSetFieldValue } = formik

  const _setSiteButtonUnsaved = useEffect(() => {
    if (formik.dirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [formik.dirty])

  const handleLatitudeChange = useCallback(
    (value) => {
      formikSetFieldValue('latitude', value)
    },
    [formikSetFieldValue],
  )

  const handleLongitudeChange = useCallback(
    (value) => {
      formikSetFieldValue('longitude', value)
    },
    [formikSetFieldValue],
  )

  const isReadOnlyUser = !(currentUserProfile.is_admin || currentUserProfile.is_collector)
  const contentViewByRole = isReadOnlyUser ? (
    <ReadOnlySiteContent
      site={formik.values}
      countries={countryOptions}
      exposures={exposureOptions}
      reefTypes={reefTypeOptions}
      reefZones={reefZoneOptions}
      isReadOnlyUser={isReadOnlyUser}
    />
  ) : (
    <>
      <form id="site-form" onSubmit={formik.handleSubmit}>
        <InputWrapper>
          <InputWithLabelAndValidation
            required
            label="Name"
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
            validationType={formik.errors.name ? 'error' : null}
            validationMessages={formik.errors.name}
            testId="name"
          />
          <InputRow required>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="country">Country</label>
            <InputAutocomplete
              id="country"
              options={countryOptions}
              value={formik.values.country}
              noResultsText={language.autocomplete.noResultsDefault}
              onChange={(selectedItem) => {
                formik.setFieldValue('country', selectedItem.value)
              }}
            />
          </InputRow>
          <InputWithLabelAndValidation
            required
            label="Latitude"
            id="latitude"
            type="number"
            {...formik.getFieldProps('latitude')}
            validationType={formik.errors.latitude ? 'error' : null}
            validationMessages={formik.errors.latitude}
            testId="latitude"
          />
          <InputWithLabelAndValidation
            required
            label="Longitude"
            id="longitude"
            type="number"
            {...formik.getFieldProps('longitude')}
            validationType={formik.errors.longitude ? 'error' : null}
            validationMessages={formik.errors.longitude}
            testId="longitude"
          />
          {isAppOnline && (
            <SingleSiteMap
              formLatitudeValue={formik.getFieldProps('latitude').value}
              formLongitudeValue={formik.getFieldProps('longitude').value}
              handleLatitudeChange={handleLatitudeChange}
              handleLongitudeChange={handleLongitudeChange}
            />
          )}
          <InputRadioWithLabelAndValidation
            required
            label="Exposure"
            id="exposure"
            options={exposureOptions}
            {...formik.getFieldProps('exposure')}
          />
          <InputRadioWithLabelAndValidation
            required
            label="Reef Type"
            id="reef_type"
            options={reefTypeOptions}
            {...formik.getFieldProps('reef_type')}
          />
          <InputRadioWithLabelAndValidation
            required
            label="Reef Zone"
            id="reef_zone"
            options={reefZoneOptions}
            {...formik.getFieldProps('reef_zone')}
          />
          <TextareaWithLabelAndValidation
            label="Notes"
            id="notes"
            {...formik.getFieldProps('notes')}
          />
        </InputWrapper>
      </form>
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{ name: formik.values.name }}
      showCollectingNav={!isReadOnlyUser}
      content={contentViewByRole}
      toolbar={
        <ContentPageToolbarWrapper>
          <H2>{formik.values.name}</H2>
          {!isReadOnlyUser && (
            <SaveButton formId="site-form" saveButtonState={saveButtonState} formik={formik} />
          )}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

TableRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  options: inputOptionPropType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

TableRowItem.defaultProps = {
  options: undefined,
}

ReadOnlySiteContent.propTypes = {
  site: sitePropType.isRequired,
  countries: inputOptionPropType.isRequired,
  exposures: inputOptionPropType.isRequired,
  reefTypes: inputOptionPropType.isRequired,
  reefZones: inputOptionPropType.isRequired,
  isReadOnlyUser: PropTypes.bool.isRequired,
}

Site.propTypes = {
  currentUser: currentUserPropType.isRequired,
}

export default Site

import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'

import {
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { ButtonCallout, ButtonCaution } from '../../../generic/buttons'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { ContentPageLayout } from '../../../Layout'
import { databaseSwitchboardPropTypes } from '../../../../App/mermaidData/databaseSwitchboard'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { H2 } from '../../../generic/text'
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { RowRight } from '../../../generic/positioning'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import EditCollectRecordFormTitle from '../../../EditCollectRecordFormTitle'
import FishBeltTransectInputs from '../../../FishBeltTransectInputs'
import language from '../../../../language'
import SampleInfoInputs from '../../../SampleInfoInputs'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import OfflineHide from '../../../generic/OfflineHide'

/*
  Fishbelt component lets a user edit and delete a record as well as create a new record.
*/

const FishBelt = ({ databaseSwitchboardInstance, isNewRecord }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const { recordId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const history = useHistory()
  const showDeleteConfirmPrompt = () => {
    setShowDeleteModal(true)
  }
  const closeDeleteConfirmPrompt = () => {
    setShowDeleteModal(false)
  }

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(),
        databaseSwitchboardInstance.getChoices(),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            collectRecordResponse,
          ]) => {
            if (isMounted) {
              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setIsLoading(false)
              setCollectRecordBeingEdited(collectRecordResponse)
            }
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(error)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, recordId, isNewRecord])

  const {
    persistUnsavedFormData,
    clearPersistedUnsavedFormData,
    getPersistedUnsavedFormData,
  } = useUnsavedDirtyFormDataUtilities('unsavedFishbeltForm')

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteFishBelt(collectRecordBeingEdited.id)
        .then(() => {
          clearPersistedUnsavedFormData()
          toast.success(language.success.collectRecordDelete)
          history.push(`${ensureTrailingSlash(currentProjectPath)}collecting`)
        })
        .catch(() => {
          toast.error(language.error.collectRecordDelete)
          closeDeleteConfirmPrompt()
        })
    }
  }
  const saveRecord = (formValues) => {
    const newRecord = reformatFormValuesIntoFishBeltRecord(
      formValues,
      collectRecordBeingEdited,
    )

    databaseSwitchboardInstance
      .saveFishBelt(newRecord)
      .then((response) => {
        toast.success(language.success.collectRecordSave)
        clearPersistedUnsavedFormData()
        if (isNewRecord) {
          history.push(
            `${ensureTrailingSlash(history.location.pathname)}${response.id}`,
          )
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordSave)
      })
  }

  const initialFormValues = useMemo(
    () =>
      getPersistedUnsavedFormData() ?? {
        ...getSampleInfoInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
        ...getTransectInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
      },
    [collectRecordBeingEdited, getPersistedUnsavedFormData],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
    validate: (values) => {
      persistUnsavedFormData(values)
    },
    onSubmit: saveRecord,
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isLoading={isLoading}
          content={
            <>
              <form
                id="fishbelt-form"
                aria-labelledby="fishbelt-form-title"
                onSubmit={formik.handleSubmit}
              >
                <SampleInfoInputs
                  formik={formik}
                  sites={sites}
                  managementRegimes={managementRegimes}
                />
                <FishBeltTransectInputs formik={formik} choices={choices} />
              </form>
              <ButtonCaution
                onClick={showDeleteConfirmPrompt}
                disabled={isNewRecord}
              >
                Delete Record
              </ButtonCaution>
              <DeleteRecordConfirm
                isOpen={showDeleteModal}
                onDismiss={closeDeleteConfirmPrompt}
                onConfirm={deleteRecord}
              />
            </>
          }
          toolbar={
            <>
              {isNewRecord && <H2>Fish Belt</H2>}
              {collectRecordBeingEdited && !isNewRecord && (
                <EditCollectRecordFormTitle
                  collectRecord={collectRecordBeingEdited}
                  sites={sites}
                />
              )}

              <RowRight data-testid="fishbelt-form-buttons">
                <ButtonCallout type="submit" form="fishbelt-form">
                  <IconSave />
                  Save
                </ButtonCallout>
                {!isNewRecord && (
                  <OfflineHide>
                    <ButtonCallout>
                      <IconCheck />
                      Validate
                    </ButtonCallout>
                    <ButtonCallout>
                      <IconUpload />
                      Submit
                    </ButtonCallout>
                  </OfflineHide>
                )}
              </RowRight>
            </>
          }
        />
      )}
    </Formik>
  )
}

FishBelt.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
  isNewRecord: PropTypes.bool,
}

FishBelt.defaultProps = {
  isNewRecord: true,
}

export default FishBelt

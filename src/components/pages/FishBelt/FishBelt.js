import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getSampleInfoValidationInfo,
} from '../../../library/collectRecordHelpers'
import { ButtonCallout } from '../../generic/buttons'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import { RowRight } from '../../generic/positioning'
import language from '../../../language'
import FishBeltTransectForms from '../../FishBeltTransectForms'
import SampleInfoInputs from '../../SampleInfoInputs'
import CollectRecordFormTitle from '../../CollectRecordFormTitle'
import { ContentPageLayout } from '../../Layout'

const FishBelt = ({ databaseSwitchboardInstance, isNewRecord }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [sites, setSites] = useState([])
  const { recordId } = useParams()

  const _getSupportingData = useEffect(() => {
    if (isNewRecord) {
      databaseSwitchboardInstance
        .getChoices()
        .then((choicesResponse) => {
          setChoices(choicesResponse)
          setIsLoading(false)
        })
        .catch(() => {
          toast.error(language.error.collectRecordChoicesUnavailable)
        })
    }
    if (databaseSwitchboardInstance && recordId && !isNewRecord) {
      Promise.all([
        databaseSwitchboardInstance.getCollectRecord(recordId),
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(),
        databaseSwitchboardInstance.getChoices(),
      ])
        .then(
          ([
            collectRecord,
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
          ]) => {
            setCollectRecordBeingEdited(collectRecord)
            setSites(sitesResponse)
            setManagementRegimes(managementRegimesResponse)
            setChoices(choicesResponse)
            setIsLoading(false)
          },
        )
        .catch(() => {
          toast.error(language.error.collectRecordUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, recordId, isNewRecord])

  const collectRecordData = collectRecordBeingEdited?.data
  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordData, 'fishbelt_transect'),
      ...getTransectInitialValues(collectRecordData, 'fishbelt_transect'),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      ...getSampleInfoValidationInfo({ sites, managementRegimes }),
      transectNumber: Yup.number().required('Transect number is required'),
      transectNLengthSurveyed: Yup.number().required(
        'Transect length surveyed is required',
      ),
      width: Yup.string().required('Width is required'),
      fishSizeBin: Yup.string().required('Fish size bin is required'),
    }),
    onSubmit: () => {},
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isLoading={isLoading}
          content={
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
              <FishBeltTransectForms formik={formik} choices={choices} />
            </form>
          }
          toolbar={
            <>
              <CollectRecordFormTitle
                collectRecordData={collectRecordData}
                sites={sites}
              />
              <RowRight>
                <ButtonCallout
                  type="submit"
                  onSubmit={formik.handleSubmit}
                  form="sampleinfo-form"
                >
                  Save
                </ButtonCallout>
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

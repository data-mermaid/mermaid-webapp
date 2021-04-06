import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'

import {
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getSampleInfoValidationInfo,
} from '../../../library/collectRecordHelpers'
import { ButtonCallout } from '../../generic/buttons'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import { RowRight } from '../../generic/positioning'
import FishBeltTransectForms from '../../FishBeltTransectForms'
import language from '../../../language'
import SampleInfoInputs from '../../SampleInfoInputs'
import { ContentPageLayout } from '../../Layout'
import { H2 } from '../../generic/text'

const EditFishBelt = ({ databaseSwitchboardInstance }) => {
  const { recordId } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})

  const _getSupportingData = useEffect(() => {
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
  }, [databaseSwitchboardInstance, recordId])

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
                collectRecord={collectRecordBeingEdited}
                sites={sites}
                managementRegimes={managementRegimes}
              />
              <FishBeltTransectForms formik={formik} choices={choices} />
            </form>
          }
          toolbar={
            <>
              <H2 id="fishbelt-form-title">
                Placeholder Collect Record Form Title
              </H2>
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

EditFishBelt.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default EditFishBelt

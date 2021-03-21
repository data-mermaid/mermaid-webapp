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
import { mermaidDatabaseGatewayPropTypes } from '../../../library/mermaidData/MermaidDatabaseGateway'
import { RowRight } from '../../generic/positioning'
import FishBeltTransectForms from '../../FishBeltTransectForms'
import language from '../../../language'
import SampleInfoInputs from '../../SampleInfoInputs'
import SubLayout2 from '../../SubLayout2'

const EditFishBelt = ({ databaseGatewayInstance }) => {
  const { recordId } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])

  const _getSupportingData = useEffect(() => {
    Promise.all([
      databaseGatewayInstance.getCollectRecord(recordId),
      databaseGatewayInstance.getSites(),
      databaseGatewayInstance.getManagementRegimes(),
    ])
      .then(([collectRecord, sitesResponse, managementRegimesResponse]) => {
        setCollectRecordBeingEdited(collectRecord)
        setSites(sitesResponse)
        setManagementRegimes(managementRegimesResponse)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error(language.error.collectRecordUnavailable)
      })
  }, [databaseGatewayInstance, recordId])

  const collectRecordData = collectRecordBeingEdited?.data

  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordData, 'fishbelt_transect'),
      ...getTransectInitialValues(collectRecordData, 'fishbelt_transect'),
      width: 'value 1',
      fishSizeBin: 'value 1',
      reefSlope: 'value 1',
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
        <SubLayout2
          isLoading={isLoading}
          content={
            <form id="fishbelt-form" onSubmit={formik.handleSubmit}>
              <SampleInfoInputs
                formik={formik}
                collectRecord={collectRecordBeingEdited}
                sites={sites}
                managementRegimes={managementRegimes}
              />
              <FishBeltTransectForms formik={formik} />
            </form>
          }
          toolbar={
            <RowRight>
              <ButtonCallout
                type="submit"
                onSubmit={formik.handleSubmit}
                form="sampleinfo-form"
              >
                Save
              </ButtonCallout>
            </RowRight>
          }
        />
      )}
    </Formik>
  )
}

EditFishBelt.propTypes = {
  databaseGatewayInstance: mermaidDatabaseGatewayPropTypes.isRequired,
}

export default EditFishBelt

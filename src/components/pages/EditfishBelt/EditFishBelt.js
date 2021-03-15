import { Formik } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import React, { useState } from 'react'

import SubLayout2 from '../../SubLayout2'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import SampleInfoInputs from '../../SampleInfoInputs'
import {
  getSampleInfoInitialValues,
  getSampleInfoValidationInfo,
} from '../../../library/collectRecordHelpers'
import FishBeltTransectForms from '../../FishBeltTransectForms'

const EditFishBelt = ({ mermaidData }) => {
  const { recordId } = useParams()
  const { sites, managementRegimes } = mermaidData

  const [collectRecordBeingEdited] = useState(
    mermaidData.getCollectRecord(recordId),
  )

  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordBeingEdited),
      transectNumber: '-9999',
      label: 'Placeholder initial value',
      transectLengthSurveyed: '-9999',
      width: 'value 1',
      fishSizeBin: 'value 1',
      reefSlope: 'value 1',
      notes: 'Placeholder initial value',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      ...getSampleInfoValidationInfo(mermaidData),
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
          lowerRight={
            <form id="benthiclit-form" onSubmit={formik.handleSubmit}>
              <SampleInfoInputs
                formik={formik}
                collectRecord={collectRecordBeingEdited}
                sites={sites}
                managementRegimes={managementRegimes}
              />
              <FishBeltTransectForms formik={formik} />
            </form>
          }
          upperRight={
            <RowRight>
              <ButtonCallout
                type="submit"
                onSubmit={formik.handleSubmit}
                form="benthiclit-form"
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
  mermaidData: mermaidDataPropType.isRequired,
}

export default EditFishBelt

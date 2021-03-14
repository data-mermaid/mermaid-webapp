import { Formik, useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import React, { useState } from 'react'

import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import SampleInfoInputs from '../../SampleInfoInputs'
import {
  getSampleInfoInitialValues,
  getSampleInfoValidationInfo,
} from '../../../library/collectRecordHelpers'

const CollectRecord = ({ mermaidData }) => {
  const { recordId } = useParams()
  const { sites, managementRegimes } = mermaidData

  const [collectRecordBeingEdited] = useState(
    mermaidData.getCollectRecord(recordId),
  )

  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordBeingEdited),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      ...getSampleInfoValidationInfo(mermaidData),
    }),
    onSubmit: () => {},
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <SubLayout2
          sidebar={<NavMenu />}
          lowerRight={
            <form id="benthiclit-form" onSubmit={formik.handleSubmit}>
              <SampleInfoInputs
                formik={formik}
                collectRecord={collectRecordBeingEdited}
                sites={sites}
                managementRegimes={managementRegimes}
              />
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

CollectRecord.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

export default CollectRecord

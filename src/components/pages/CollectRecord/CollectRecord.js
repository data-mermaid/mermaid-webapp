import { Formik, useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import React, { useState } from 'react'

import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import SampleInfoForms from '../../SampleInfoForms'

const CollectRecord = ({ mermaidData }) => {
  const { recordId } = useParams()
  const { collectRecords, sites, managementRegimes } = mermaidData

  const initializeCollectRecordBeingEdited = (record) =>
    collectRecords.filter(({ id }) => id === record)[0]

  const [collectRecordBeingEdited] = useState(
    initializeCollectRecordBeingEdited(recordId),
  )

  const validSiteValues = sites.map((site) => site.id)

  const validManagementRegimeValues = managementRegimes.map(
    (regime) => regime.id,
  )

  const formikOptions = {
    initialValues: {
      depth: collectRecordBeingEdited.depth,
      site: collectRecordBeingEdited.site.id,
      management: collectRecordBeingEdited.management.id,
      sampleDate: '',
      sampleTime: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      site: Yup.string()
        .oneOf(validSiteValues, 'Invalid site')
        .required('Site is required'),
      management: Yup.string()
        .oneOf(validManagementRegimeValues, 'Invalid management regime')
        .required('Management Regime is required'),
      depth: Yup.number().required('Depth is required'),
    }),
    onSubmit: (values) => console.log('here', values),
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <SubLayout2
          sidebar={<NavMenu />}
          lowerRight={
            <form id="benthiclit-form" onSubmit={formik.handleSubmit}>
              <SampleInfoForms
                formik={formik}
                collectRecord={collectRecordBeingEdited}
                sites={sites}
                managementRegimes={managementRegimes}
              />
              {/* // put transect here */}
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

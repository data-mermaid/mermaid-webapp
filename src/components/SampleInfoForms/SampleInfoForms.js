import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import MermaidInput from '../generic/MermaidInput'
import MermaidSelect from '../generic/MermaidSelect'
import { H2 } from '../generic/text'

const SampleInfoForms = ({ collectRecord, sites, managementRegimes }) => {
  const { site, management, depth } = collectRecord
  const siteNameOptions = sites.map((item) => item.name)
  const managementNameOptions = managementRegimes.map((item) => item.name)

  return (
    <>
      <H2>Sample Info</H2>
      <Formik
        initialValues={{
          depth,
          site,
          management,
          sampleDate: '',
          sampletime: '',
        }}
        validationSchema={Yup.object({
          site: Yup.string()
            .oneOf(siteNameOptions, 'Invalid site')
            .required('Site is required'),
          management: Yup.string()
            .oneOf(managementNameOptions, 'Invalid management regime')
            .required('Management Regime is required'),
          depth: Yup.number().required('Depth is required'),
        })}
        // onSubmit={(values) => {}}
      >
        <Form>
          <MermaidSelect label="Site" name="site" options={sites} />
          <MermaidSelect
            label="Management"
            name="management"
            options={managementRegimes}
          />
          <MermaidInput label="Depth" name="depth" type="number" />
          <MermaidInput label="Sample Date" name="sampleDate" type="date" />
          <MermaidInput label="Sample Time" name="sampletime" type="time" />
        </Form>
      </Formik>
    </>
  )
}

SampleInfoForms.propTypes = {
  collectRecord: PropTypes.shape({
    site: PropTypes.string,
    management: PropTypes.string,
    depth: PropTypes.number,
  }).isRequired,
  sites: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  managementRegimes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
}

export default SampleInfoForms

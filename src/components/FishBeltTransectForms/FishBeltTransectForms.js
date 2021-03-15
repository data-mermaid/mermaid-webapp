import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import MermaidInput from '../generic/MermaidInput'
import MermaidSelect from '../generic/MermaidSelect'
import { H2 } from '../generic/text'

/**
 * Describe your component
 */
const FishBeltTransectForms = () => {
  const emptyOption = [
    { name: 'option 1' },
    { name: 'option 2' },
    { name: 'option 3' },
    { name: 'option 4' },
  ]

  return (
    <>
      <H2>Transect</H2>
      <Formik
        initialValues={{
          transectNumber: '',
          label: '',
          transectLengthSurveyed: '',
          width: '',
          fishSizeBin: '',
          reefSlope: '',
          notes: '',
        }}
        validationSchema={Yup.object({
          transectNumber: Yup.number().required('Transect number is required'),
          transectNLengthSurveyed: Yup.number().required(
            'Transect length surveyed is required',
          ),
          width: Yup.string().required('Width is required'),
          fishSizeBin: Yup.string().required('Fish size bin is required'),
        })}
        // onSubmit={(values) => {}}
      >
        <Form>
          <MermaidInput
            label="Transect Number"
            name="transectNumber"
            type="number"
          />
          <MermaidInput label="Label" name="label" type="text" />
          <MermaidInput
            label="Transect Length Surveyed"
            name="transectLengthSurveyed"
            type="number"
          />
          <MermaidSelect label="Width" name="width" options={emptyOption} />
          <MermaidSelect
            label="Fish Size Bin"
            name="fishSizeBin"
            options={emptyOption}
          />
          <MermaidSelect
            label="Reef Slope"
            name="reefSlope"
            options={emptyOption}
          />
          <MermaidInput label="Notes" name="notes" type="text-area" />
        </Form>
      </Formik>
    </>
  )
}

export default FishBeltTransectForms

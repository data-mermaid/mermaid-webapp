import React from 'react'

import { choicesPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../../../library/formikPropType'
import { getOptions } from '../../../../library/getOptions'
import { H2 } from '../../../generic/text'
import InputRadioWithLabelAndValidation from '../../../mermaidInputs/InputRadioWithLabelAndValidation'
import InputWithLabelAndValidation from '../../../mermaidInputs/InputWithLabelAndValidation'
import { InputWrapper } from '../../../generic/form'

const TransectInputs = ({ choices, formik }) => {
  const { currents, relativedepths, tides, visibilities } = choices

  const currentOptions = [...getOptions(currents), { label: 'not reported', value: '' }]
  const relativeDepthOptions = [...getOptions(relativedepths), { label: 'not reported', value: '' }]
  const tideOptions = [...getOptions(tides), { label: 'not reported', value: '' }]
  const visibilityOptions = [...getOptions(visibilities), { label: 'not reported', value: '' }]

  const handleTransectNumberChange = (event) => {
    formik.handleChange(event)
  }
  const handleLabelChange = (event) => {
    formik.handleChange(event)
  }
  const handleSampleTimeChange = (event) => {
    formik.handleChange(event)
  }
  const handleDepthChange = (event) => {
    formik.handleChange(event)
  }
  const handleLengthSurveyedChange = (event) => {
    formik.handleChange(event)
  }
  const handleQuadratSizeChange = (event) => {
    formik.handleChange(event)
  }
  const handleNumberOfQuadratsChange = (event) => {
    formik.handleChange(event)
  }
  const handleNumberOfPointsPerQuadratChange = (event) => {
    formik.handleChange(event)
  }
  const handleVisibilityChange = (event) => {
    formik.handleChange(event)
  }
  const handleCurrentChange = (event) => {
    formik.handleChange(event)
  }
  const handleRelativeDepthChange = (event) => {
    formik.handleChange(event)
  }
  const handleTideChange = (event) => {
    formik.handleChange(event)
  }

  return (
    <>
      <InputWrapper>
        <H2>Transect</H2>
        <InputWithLabelAndValidation
          label="Transect Number"
          required={true}
          id="number"
          testId="transect_number"
          type="number"
          onBlur={formik.handleBlur}
          value={formik.values.number}
          onChange={handleTransectNumberChange}
        />
        <InputWithLabelAndValidation
          label="Label"
          id="label"
          testId="label"
          type="text"
          onBlur={formik.handleBlur}
          value={formik.values.label}
          onChange={handleLabelChange}
        />
        <InputWithLabelAndValidation
          label="Sample Time"
          id="sample_time"
          testId="sample_time"
          type="time"
          onBlur={formik.handleBlur}
          value={formik.values.sample_time}
          onChange={handleSampleTimeChange}
        />
        <InputWithLabelAndValidation
          label="Depth"
          required={true}
          id="depth"
          onBlur={formik.handleBlur}
          value={formik.values.depth}
          onChange={handleDepthChange}
        />
        <InputWithLabelAndValidation
          label="Transect Length Surveyed"
          id="len_surveyed"
          testId="len_surveyed"
          type="number"
          onBlur={formik.handleBlur}
          value={formik.values.len_surveyed}
          onChange={handleLengthSurveyedChange}
        />
        <InputWithLabelAndValidation
          label="Quadrat Size"
          id="quadrat_size"
          testId="quadrat_size"
          type="number"
          unit="m2"
          onBlur={formik.handleBlur}
          value={formik.values.quadrat_size}
          onChange={handleQuadratSizeChange}
        />
        <InputWithLabelAndValidation
          label="Number of Quadrats"
          id="num_quadrats"
          testId="num_quadrats"
          type="number"
          onBlur={formik.handleBlur}
          value={formik.values.num_quadrats}
          onChange={handleNumberOfQuadratsChange}
        />
        <InputWithLabelAndValidation
          label="Number of Points per Quadrat"
          id="num_points_per_quadrat"
          testId="num_points_per_quadrat"
          type="number"
          onBlur={formik.handleBlur}
          value={formik.values.num_points_per_quadrat}
          onChange={handleNumberOfPointsPerQuadratChange}
        />
        <InputRadioWithLabelAndValidation
          label="Visibility"
          id="visibility"
          name="visibility"
          testId="visibility"
          options={visibilityOptions}
          value={formik.values.visibility}
          onBlur={formik.handleBlur}
          onChange={handleVisibilityChange}
        />
        <InputRadioWithLabelAndValidation
          label="Current"
          id="current"
          name="current"
          testId="current"
          options={currentOptions}
          onBlur={formik.handleBlur}
          value={formik.values.current}
          onChange={handleCurrentChange}
        />
        <InputRadioWithLabelAndValidation
          label="Relative Depth"
          id="relative_depth"
          name="relative_depth"
          testId="relative_depth"
          options={relativeDepthOptions}
          onBlur={formik.handleBlur}
          value={formik.values.relative_depth}
          onChange={handleRelativeDepthChange}
        />
        <InputRadioWithLabelAndValidation
          label="Tide"
          id="tide"
          name="tide"
          testId="tide"
          options={tideOptions}
          onBlur={formik.handleBlur}
          value={formik.values.tide}
          onChange={handleTideChange}
        />
      </InputWrapper>
    </>
  )
}

TransectInputs.propTypes = {
  choices: choicesPropType.isRequired,
  formik: formikPropType.isRequired,
}

TransectInputs.defaultProps = {}

export default TransectInputs

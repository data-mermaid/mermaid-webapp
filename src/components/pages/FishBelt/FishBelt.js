import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../../../library/formikHelpers/collectRecordHelpers'
import { ButtonCallout } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import { H2 } from '../../generic/text'
import { RowRight } from '../../generic/positioning'
import language from '../../../language'
import FishBeltTransectForms from '../../FishBeltTransectForms'
import SampleInfoInputs from '../../SampleInfoInputs'
import EditCollectRecordFormTitle from '../../EditCollectRecordFormTitle'
import { H2 } from '../../generic/text'

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

  const reformatFormValuesIntoFishBeltRecord = (values) => {
    const {
      management,
      notes,
      sample_date,
      site,

      depth,
      label,
      len_surveyed,
      number,
      reef_slope,
      sample_time,
      size_bin,
      width,
    } = values

    return {
      ...collectRecordBeingEdited,
      data: {
        fishbelt_transect: {
          depth,
          label,
          len_surveyed,
          number,
          reef_slope,
          sample_time,
          size_bin,
          width,
        },
        sample_event: { management, notes, sample_date, site },
      },
    }
  }
  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordData, 'fishbelt_transect'),
      ...getTransectInitialValues(collectRecordData, 'fishbelt_transect'),
    },
    enableReinitialize: true,

    onSubmit: (values) => {
      const newRecord = reformatFormValuesIntoFishBeltRecord(values)

      databaseSwitchboardInstance
        .saveFishBelt(newRecord)
        .then(() => toast.success(language.success.collectRecordSave))
        .catch(() => toast.error(language.error.collectRecordSave))
    },
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
              {isNewRecord && <H2>Fish Belt</H2>}
              {collectRecordBeingEdited && !isNewRecord && (
                <EditCollectRecordFormTitle
                  collectRecord={collectRecordBeingEdited}
                  sites={sites}
                />
              )}

              <RowRight>
                <ButtonCallout type="submit" form="fishbelt-form">
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

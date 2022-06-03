import React from 'react'
import PropTypes from 'prop-types'
import language from '../../../../language'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'

const BenthicPhotoQuadrat = ({ isNewRecord }) => {
  return (
    <ContentPageLayout
      content=""
      toolbar={
        <ContentPageToolbarWrapper>
          {isNewRecord && <H2>{language.pages.benthicPhotoQuadratForm.title}</H2>}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

BenthicPhotoQuadrat.propTypes = {
  isNewRecord: PropTypes.bool,
}

BenthicPhotoQuadrat.defaultProps = {
  isNewRecord: true,
}
export default BenthicPhotoQuadrat

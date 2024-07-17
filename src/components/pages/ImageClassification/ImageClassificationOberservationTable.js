import React from 'react'
import styled from 'styled-components'
import { H2 } from '../../generic/text'
import { InputWrapper } from '../../generic/form'
import {
  StyledOverflowWrapper,
  StickyObservationTable,
} from '../collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Th } from '../../generic/Table/table'
// import PropTypes from 'prop-types';

const StyledColgroup = styled('colgroup')`
  col {
    &.thumbnail {
      width: 5rem;
    }
    &.quadrat {
      width: 15rem;
    }
    &.benthicAttribute {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.numberOfPoints {
      width: 20rem;
    }
    &.validation {
      width: auto;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const ImageClassificationObservationTable = () => {
  return (
    <InputWrapper>
      <H2 id="table-label">Observations</H2>
      <StyledOverflowWrapper>
        <StickyObservationTable aria-labelledby="table-label">
          <StyledColgroup>
            <col className="number" />
            <col className="thumbnail" />
            <col className="quadrat" />
            <col className="benthicAttribute" />
            <col className="growthForm" />
            <col className="numberOfPoints" />
            {/* {areValidationsShowing ? <col className="validations" /> : null} */}
            <col className="remove" />
          </StyledColgroup>
          <thead>
            <Tr>
              <Th> </Th>
              <Th align="right" id="thumbnail-label">
                <span>Thumbnail</span>
              </Th>
              <Th align="right" id="quadrat-number-label">
                <span>Quadrat</span>
              </Th>
              <Th align="left" id="benthic-attribute-label">
                <span>Benthic Attribute</span>
              </Th>
              <Th align="right" id="growth-form-label">
                <span>Growth Form</span>
              </Th>
              <Th colSpan="3" align="center" id="number-of-points-label">
                <span>Number of Points</span>
              </Th>
              <Th> </Th>
            </Tr>
            <Tr>
              <Th> </Th>
              <Th> </Th>
              <Th> </Th>
              <Th> </Th>
              <Th> </Th>
              <Th align="center">
                <span>Confirmed</span>
              </Th>
              <Th align="center">
                <span>Unconfirmed</span>
              </Th>
              <Th align="center">
                <span>Unknown</span>
              </Th>
              <Th> </Th>
            </Tr>
          </thead>
          {/* <tbody>{observationsRows}</tbody> */}
        </StickyObservationTable>
      </StyledOverflowWrapper>
    </InputWrapper>
  )
}

// ImageClassificationObservationTable.propTypes = {}

export default ImageClassificationObservationTable

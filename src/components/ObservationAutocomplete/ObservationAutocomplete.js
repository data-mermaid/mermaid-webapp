import React from 'react'
import styled from 'styled-components'
import InputAutocomplete from '../generic/InputAutocomplete'

export const StyledInputAutocomplete = styled(InputAutocomplete)`
  & input {
    border: none;
  }
  width: 100%;
  text-align: inherit;
  padding: 0;
`

const ObservationAutocomplete = (props) => {
  return <StyledInputAutocomplete {...props} />
}

export default ObservationAutocomplete

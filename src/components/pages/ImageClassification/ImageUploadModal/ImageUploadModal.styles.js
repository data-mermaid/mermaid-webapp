import styled from 'styled-components'

const DropZone = styled.div`
  border: 2px dashed #007bff;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  border-radius: 4px;
`

const HiddenInput = styled.input`
  display: none;
`

const ButtonContainer = styled.div`
  display: flex;
`

export { DropZone, HiddenInput, ButtonContainer }

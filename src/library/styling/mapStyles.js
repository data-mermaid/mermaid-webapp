import styled from 'styled-components/macro'
import { InputRow } from '../../components/generic/form'

export const MapInputRow = styled(InputRow)`
  grid-template-columns: 0.75fr 2.5fr;
`
export const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`
export const MapWrapper = styled.div`
  height: 100%;
  min-height: 70vh;
`

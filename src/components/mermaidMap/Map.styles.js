import styled from 'styled-components/macro'
import { InputRow } from '../generic/form'

export const MapInputRow = styled(InputRow)`
  grid-template-columns: 1fr;
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

export const MapZoomHelpMessage = styled('div')`
  position: absolute;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #ffffff;
  font-size: 2rem;
`

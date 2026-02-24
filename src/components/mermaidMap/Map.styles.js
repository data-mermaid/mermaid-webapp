import { styled } from 'styled-components'
import { InputRow } from '../generic/form'
import MapPin from '../../assets/map-pin.png'

export const MapInputRow = styled(InputRow)`
  grid-template-columns: 1fr;
  border-width: ${(props) => props.$noBorderWidth && '0px'};
`
export const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

export const MapWrapper = styled.div`
  height: 100%;
  min-height: ${(props) => (props.$minHeight ? props.$minHeight : '70vh')};

  #marker {
    background-image: url(${MapPin});
    background-size: cover;
    width: 31px;
    height: 31px;
    cursor: move;
  }

  svg {
    display: none;
  }
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
export const MiniMapContainer = styled.div`
  position: absolute;
  bottom: 5px;
  left: 15px;
  width: 200px;
  height: 150px;
`

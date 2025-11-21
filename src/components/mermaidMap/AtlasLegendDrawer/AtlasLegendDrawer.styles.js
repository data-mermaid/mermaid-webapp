import { styled } from 'styled-components'
import { H3 } from '../../generic/text'
import theme from '../../../theme'

export const SliderContainer = styled.div`
  position: absolute;
  width: 270px;
  overflow-y: auto;
  height: 66vh;
  right: ${(props) => (props.isOpen ? '0px' : '-270px')};
  background: ${(props) => props.isOpen && 'rgba(255, 255, 255, 1)'};
  top: 1px;
  transition: 0.3s ease-out;
`

export const SliderHandler = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 1);
  height: 120px;
  width: 20px;
  cursor: pointer;
  top: 10%;
  right: ${(props) => (props.isOpen ? '270px' : '0px')};
  border-right: 1px solid;
  transition: 0.3s ease-out;
  visibility: visible;
`

export const SliderHandlerName = styled.span`
  display: inline-block;
  position: relative;
  transform: rotate(-90deg);
  top: 50px;
  left: -45px;
  font-size: 1.5rem;
`

export const SliderLegendPanel = styled.div`
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
`

export const LegendHeader = styled(H3)`
  text-align: center;
`

export const LegendBody = styled.div`
  padding: 0 5px;
  font-size: 1.5rem;
  overflow-y: scroll;
`

export const CheckBoxLabel = styled.label`
  padding: ${theme.spacing.xsmall};
  width: ${(props) => props.fullWidth && '100%'};
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

export const LegendColor = styled.div`
  height: 15px;
  width: 50px;
  border: 1px solid;
  float: right;
  margin-top: 2px;
  background-color: ${(props) => props.bgColor && props.bgColor};
`

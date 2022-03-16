import { createGlobalStyle, css } from 'styled-components'
import raw from 'raw.macro'
import theme from '../../theme'
import { hoverState } from './mediaQueries'
import '@fontsource/open-sans'
import '@fontsource/open-sans/700.css'

const toastifyCss = raw('react-toastify/dist/ReactToastify.css')
const maplibreglCss = raw('maplibre-gl/dist/maplibre-gl.css')

const GlobalStyle = createGlobalStyle`
    ${toastifyCss}
    ${maplibreglCss}
    :root {
        font-size: 62.5%;
    }
    body {
        background-color: ${theme.color.backgroundColor};
    }
    body, select, input, textarea, button, p, a{
        font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'; 
        font-size: ${theme.typography.defaultFontSize};
        color: ${theme.color.textColor};
        -webkit-font-smoothing: antialiased;
    
    }
    select, input, textarea, p, a, button{
        line-height: ${theme.typography.lineHeight};

    }
    svg {
        width: ${props => props.theme.typography.defaultIconSize};
        height: ${props => props.theme.typography.defaultIconSize};
    }
    *,*::before,*::after {
        box-sizing: border-box;
    } 
    a{
        text-decoration: underline;
        ${hoverState(css`
          text-decoration: none;
        `)}
    }
    /* mapbox popup content style */
    .mapboxgl-popup {
        border-radius: 6px;
    }
    .mapboxgl-popup-content {
        padding: 7px;
    }
    .mapboxgl-popup-content a {
        text-decoration: none;
        font-weight: bold;
    }
    .mapboxgl-popup-content div {
        border-top: 1px solid;
    }
    .mapboxgl-popup-content div p {
        margin: 0;
    }
    .mapboxgl-popup-content div p span {
        margin: 0;
        font-style: italic;
    }
`

export default GlobalStyle

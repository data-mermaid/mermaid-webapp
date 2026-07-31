import { createGlobalStyle, css } from 'styled-components'
import theme from '../../theme'
import { hoverState } from './mediaQueries'
import '@fontsource/open-sans'
import '@fontsource/open-sans/700.css'

const GlobalStyle = createGlobalStyle`
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
        width: ${(props) => props.theme.typography.defaultIconSize};
        height: ${(props) => props.theme.typography.defaultIconSize};
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
    @keyframes validation-target-highlight-fade {
        0% { background-color: var(--validation-target-highlight-color, ${
          theme.color.chipWarningBackground
        }); }
        100% { background-color: transparent; }
    }
    .validation-target-highlight {
        animation: validation-target-highlight-fade ${
          theme.timing.validationTargetHighlightMs
        }ms ease-out;
    }
`

export default GlobalStyle

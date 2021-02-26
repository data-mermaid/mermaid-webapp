const { createGlobalStyle } = require('styled-components')

const GlobalStyle = createGlobalStyle`
    :root{
        font-size: 62.5%;
    }
    body {
        background: ${(props) => props.theme.color.backgroundColor};
        font: 1.8rem/1.2 Arial, Helvetica Neue, Helvetica, sans-serif;
    }
    *,*::before,*::after{
        box-sizing: border-box;
    } 
`

export default GlobalStyle

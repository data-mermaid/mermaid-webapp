# Mermaid Webapp

## Steps to Set Up Development Environment

1. clone this repo
1. yarn install
1. yarn start

## Dev Notes

1. `plop <filename>` scaffolds component files inside the `src/components` directory
1. `src/components/generic` are be for reusable components that may be useful for other projects. They should be developed to be completely unaware of their context. Make them 'dumb' (employ inversion of control).
1. `src/components/pages` are for pages or page-like components
1. Styles will be done with Styled Components for easy scoping, speed, and maintainability. Make sure to import using the macro for easier debugging (it results in more human-friendly classnames) `import styled from 'styled-components/macro'`
1. Focus on integration tests, and testing complex pieces of code.

import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render } from '@testing-library/react'


import Breadcrumbs from './Breadcrumbs'

test('Breadcrumbs component renders with the expected UI elements', () => {
const utilities = render(
<Breadcrumbs />)

expect(utilities.getByText('I should fail'))
})
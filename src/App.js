import React from 'react'
import Layout from './components/generic/Layout'
import Nav from './components/Nav'
import Header from './components/Header'
import Footer from './components/Footer'
import Breadcrumbs from './components/generic/Breadcrumbs'

function App() {
  const layoutProps = {
    nav: <Nav />,
    header: <Header />,
    footer: <Footer />,
    breadcumbs: <Breadcrumbs />,
  }

  return (
    <Layout {...layoutProps} foo="fjdksl">
      children
    </Layout>
  )
}

export default App

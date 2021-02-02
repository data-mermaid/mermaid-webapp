import React from 'react'
import Layout from './components/generic/Layout'
import Nav from './components/Nav'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const layoutProps = { nav: <Nav />, header: <Header />, footer: <Footer /> }

  return (
    <Layout {...layoutProps} foo="fjdksl">
      children
    </Layout>
  )
}

export default App

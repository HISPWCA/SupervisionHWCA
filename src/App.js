import React from 'react'
import './App.css'
import Header from './Header/Header'
import Body from './Body/Body'
import Footer from './Footer/Footer'
import { Provider } from '@dhis2/app-runtime'
import { API_BASE_ROUTE } from './api.routes'
import { HeaderBar } from '@dhis2/ui'

const BASE_ROUTE = API_BASE_ROUTE.substring(0, API_BASE_ROUTE.indexOf('/api'))

const App = () => (
  <Provider config={{ apiVersion: 33, baseUrl: BASE_ROUTE }}>
    <HeaderBar appName='Supervision Management' />

    <div className='container-fluid m-3'>
      <Header />
      <Body />
      <Footer />
    </div>
  </Provider>
)

export default App

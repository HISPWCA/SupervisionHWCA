import React, { Component } from 'react'
import './App.css'
import Body from './components/Body'
import Footer from './components/Footer'
import { Provider } from '@dhis2/app-runtime'
import { API_BASE_ROUTE, GLOBAL_SETTINGS_ROUTE, INDICATORS_ROUTE, ME_ROUTE, SETTINGS_ROUTE, SUPERVISIONS_ROUTE } from './api.routes'
import { HeaderBar } from '@dhis2/ui'
import axios from 'axios'
import { NotificationContainer } from 'react-notifications'
import { NotificationManager } from 'react-notifications'

const BASE_ROUTE = API_BASE_ROUTE.substring(0, API_BASE_ROUTE.indexOf('/api'))

class App extends Component {
  state = {
    settingsCreated: false,
    indicatorsCreated: false,
    supervisionsCreated: false,
    globalSettingsCreated: false,
  }

  // constructor() {
    // super()
componentDidMount() {


  axios.get(SETTINGS_ROUTE)
    .then(() => this.setState({ settingsCreated: true }, () => console.clear()))
    .catch(() => axios.post(SETTINGS_ROUTE, []).then(() => this.setState({ settingsCreated: true }, () => console.clear())).catch(() => this.setState({ settingsCreated: false }, () => console.clear())))

  axios.get(INDICATORS_ROUTE)
    .then(() => this.setState({ indicatorsCreated: true }, () => console.clear()))
    .catch(() => axios.post(INDICATORS_ROUTE, []).then(() => this.setState({ indicatorsCreated: true }, () => console.clear())).catch(() => this.setState({ indicatorsCreated: false }, () => console.clear())))

  axios.get(SUPERVISIONS_ROUTE)
    .then(() => this.setState({ supervisionsCreated: true }, () => console.clear()))
    .catch(() => axios.post(SUPERVISIONS_ROUTE, []).then(() => this.setState({ supervisionsCreated: true }, () => console.clear())).catch(() => this.setState({ supervisionsCreated: false }, () => console.clear())))

  axios.get(GLOBAL_SETTINGS_ROUTE)
    .then(() => this.setState({ globalSettingsCreated: true }, () => console.clear()))
    .catch(() => axios.post(GLOBAL_SETTINGS_ROUTE, {}).then(() => this.setState({ globalSettingsCreated: true }, () => console.clear())).catch(() => this.setState({ globalSettingsCreated: false }, () => console.clear())))
  
  axios.get(ME_ROUTE)
    .then(response => localStorage.setItem('userLang', response.data.settings.keyUiLocale))
    .catch(error => NotificationManager.error(error.message, null, 3000))
    
  }

  render = () => 
      <Provider config={{ apiVersion: 29, baseUrl: BASE_ROUTE }}>
        <HeaderBar appName='Supervision Management' />
        {
          (!this.state.globalSettingsCreated || !this.state.indicatorsCreated || !this.state.settingsCreated || !this.state.supervisionsCreated) &&
          <div className="row my-5">
            <div className="col">
              {!this.state.globalSettingsCreated && <div className="d-block text-info m-1">Creating App Settings</div>}
              {this.state.globalSettingsCreated && <div className="d-block text-primary m-1">App Settings successfully created</div>}

              {!this.state.supervisionsCreated && <div className="d-block text-info m-1">Creating Supervision Settings</div>}
              {this.state.supervisionsCreated && <div className="d-block text-primary m-1">Supervision Settings successfully created</div>}

              {!this.state.indicatorsCreated && <div className="d-block text-info m-1">Creating Indicators Settings</div>}
              {this.state.indicatorsCreated && <div className="d-block text-primary m-1">Indicators Settings successfully created</div>}

              {!this.state.settingsCreated && <div className="d-block text-info m-1">Creating Custom Settings</div>}
              {this.state.settingsCreated && <div className="d-block text-primary m-1">Custom Settings successfully created</div>}
            </div>
          </div>
        }

        {
          this.state.globalSettingsCreated && this.state.indicatorsCreated && this.state.settingsCreated && this.state.supervisionsCreated &&
          <div className='container-fluid'>
            <Body />
            <Footer />
            <NotificationContainer />
          </div>
        }
      </Provider>
}

export default App
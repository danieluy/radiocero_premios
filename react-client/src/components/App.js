import React, { Component } from 'react'
import './App.scss'
import _ from 'lodash'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navbar from './navbar/Navbar';
import AppContent from './app-content/AppContent';

import session from '../session'
import events from '../events'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#F58500',
  }
});

class App extends Component {
  constructor() {
    super()
    this.state = {
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      loggedUser: null
    }
  }
  componentWillMount() {
    window.addEventListener('resize', _.debounce(this.updateWindowDimensions.bind(this), 100))
  }
  componentDidMount() {
    events.on('exception', (data) => {
      console.error(data.message)
    })
    events.on('login', (data) => {
      this.setState({
        loggedUser: data
      })
    })
    session.init()
  }
  updateWindowDimensions() {
    this.setState({
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="app-wrapper" style={{ height: `${this.state.window.height}px` }}>
          <Navbar
            loggedUser={this.state.loggedUser}
          />
          <AppContent height={this.state.window.height - 64} />
        </div>
      </MuiThemeProvider >
    )
  }
}

export default App
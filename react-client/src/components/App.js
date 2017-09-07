import React, { Component } from 'react'
import './App.scss'
import _ from 'lodash'

import { Switch, Route } from 'react-router-dom'
import Home from './home/Home'
import Users from './users/Users'
import Prizes from './prizes/Prizes'
import QuickNotice from './quick-notice/QuickNotice'

import styles from '../assets/styles'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navbar from './navbar/Navbar';
import DrawerCustom from './drawer/Drawer';

import session from '../session'
import events from '../events'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: styles.color.primary,
    accent1Color: styles.color.accent
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
      loggedUser: session.getLocalUser(),
      drawerOpen: false,
      quickNotice: null
    }
  }
  componentWillMount() {
    window.addEventListener('resize', _.debounce(this.updateWindowDimensions.bind(this), 100))
  }
  componentDidMount() {
    events.on('exception', (err) => {
      console.error(err)
    })
    events.on('login', (data) => {
      this.setState({
        loggedUser: data
      })
    })
    session.checkLoggedUser()
  }
  updateWindowDimensions() {
    this.setState({
      window: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })
  }
  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    })
  }
  onQuickNotice(message) {
    this.setState({
      quickNotice: message
    })
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="app-wrapper" style={{ height: `${this.state.window.height}px` }}>

          <QuickNotice
            message={this.state.quickNotice}
          />

          <Navbar
            loggedUser={this.state.loggedUser}
            toggleDrawer={this.toggleDrawer.bind(this)}
          />

          <DrawerCustom
            open={this.state.drawerOpen}
            toggle={this.toggleDrawer.bind(this)}
          />

          <div className="app-routes" style={{ height: `${this.state.window.height - 64}px` }}>
            <Switch>
              <Route exact path='/v2' render={() => <Home onQuickNotice={this.onQuickNotice.bind(this)} />} />
              <Route exact path='/v2/users' render={() => <Users onQuickNotice={this.onQuickNotice.bind(this)} />} />
              <Route exact path='/v2/prizes' render={() => <Prizes onQuickNotice={this.onQuickNotice.bind(this)} />} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider >
    )
  }
}

export default App
import React, { Component } from 'react'
import './App.scss'
import _ from 'lodash'

import { Switch, Route } from 'react-router-dom'
import Users from './users/Users'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navbar from './navbar/Navbar';
import DrawerCustom from './drawer/Drawer';

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
      loggedUser: session.getLocalUser(),
      drawerOpen: false
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
  render() {
    console.log('Logged user:', this.state.loggedUser)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="app-wrapper" style={{ height: `${this.state.window.height}px` }}>

          <Navbar
            loggedUser={this.state.loggedUser}
            toggleDrawer={this.toggleDrawer.bind(this)}
          />

          <DrawerCustom
            open={this.state.drawerOpen}
            toggle={this.toggleDrawer.bind(this)}
          />

          <div className="app-routes" style={{ height: `${this.state.window.height - 64}px` }}>
            <div className="app-container">
              <Switch>
                <Route exact path='/v2' component={Home} />
                <Route exact path='/v2/users' component={Users} />
              </Switch>
            </div>
          </div>
        </div>
      </MuiThemeProvider >
    )
  }
}

class Home extends Component {
  render() {
    return (
      <div>Home</div>
    )
  }
}

export default App
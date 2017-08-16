import React, { Component } from 'react'
import './App.scss'
import _ from 'lodash'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navbar from './navbar/Navbar';
import AppContent from './app-content/AppContent';

import { test } from '../radiocero-api'

test()
  .then(res => { console.log(test) })
  .catch(err => { console.error(err) })

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
      }
    }
  }
  componentWillMount() {
    window.addEventListener('resize', _.debounce(this.updateWindowDimensions.bind(this), 100))
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
          <Navbar />
          <AppContent height={this.state.window.height - 64} />
        </div>
      </MuiThemeProvider >
    )
  }
}

export default App
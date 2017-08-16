import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar';

class AppContent extends Component {
  render() {
    return (
      <div className="app-content" style={{ height: `${this.props.height}px` }}>
        App Content
      </div>
    )
  }
}

export default AppContent
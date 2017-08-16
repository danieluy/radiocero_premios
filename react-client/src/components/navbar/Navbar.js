import React, { Component } from 'react'

import AppBar from 'material-ui/AppBar';

class Navbar extends Component {
  render() {
    return (
      <AppBar
        title="Radiocero Premios v2"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    )
  }
}

export default Navbar
import React, { Component } from 'react';

import { Link } from 'react-router-dom'

import session from '../../session'
import events from '../../events'

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

import { AcountsIcon, WinnersIcon, PrizesIcon, HomeIcon } from '../../assets/icons'

class DrawerCustom extends Component {
  constructor() {
    super()
    this.state = {
      loggedUser: session.getLocalUser(),
      activeLink: window.location.pathname
    }
  }
  componentDidMount() {
    events.on('login', this.updateLoggedUser.bind(this))
  }
  updateLoggedUser() {
    this.setState({
      loggedUser: session.getLocalUser()
    })
  }
  setActiveLink(path) {
    this.setState({
      activeLink: path
    })
  }
  setConditionalStyle(path) {
    if (this.state.activeLink === path)
      return { backgroundColor: '#EEE' }
    return null
  }
  render() {
    return (
      <div>
        <Drawer
          open={this.props.open}
          docked={false}
          width={200}
          onRequestChange={this.props.toggle}
          className="drawer"
          width={300}
        >
          <div className="drawer-header">
            <img className="drawer-header-icon" src="../assets/img/icon_192.png" />
            Radiocero Premios v2
          </div>
          <Link to="/v2/" onClick={this.setActiveLink.bind(this, '/v2/')}>
            <MenuItem
              primaryText="Inicio"
              leftIcon={<HomeIcon className="drawer-link-icon" />}
              style={this.setConditionalStyle("/v2/")}
            />
          </Link>
          {this.state.loggedUser ?
            <Link to="/v2/winners" onClick={this.setActiveLink.bind(this, '/v2/winners')}>
              <MenuItem
                primaryText="Ganadores"
                leftIcon={<WinnersIcon className="drawer-link-icon" />}
                style={this.setConditionalStyle("/v2/winners")}
              />
            </Link>
            : null
          }
          {this.state.loggedUser ?
            <Link to="/v2/prizes" onClick={this.setActiveLink.bind(this, '/v2/prizes')}>
              <MenuItem
                primaryText="Premios"
                leftIcon={<PrizesIcon className="drawer-link-icon" />}
                style={this.setConditionalStyle("/v2/prizes")}
              />
            </Link>
            : null
          }
          {(this.state.loggedUser && this.state.loggedUser.role === 'admin') ?
            <Link to="/v2/users" onClick={this.setActiveLink.bind(this, '/v2/users')}>
              <MenuItem
                primaryText="Usuarios"
                leftIcon={<AcountsIcon className="drawer-link-icon" />}
                style={this.setConditionalStyle("/v2/users")}
              />
            </Link>
            : null
          }
        </Drawer>
      </div>
    );
  }
}

export default DrawerCustom;
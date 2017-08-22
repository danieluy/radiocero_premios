import React, { Component } from 'react';
import './Drawer.scss'

import { Link } from 'react-router-dom'

import session from '../../session'

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

import { AcountsIcon, WinnersIcon, PrizesIcon, HomeIcon } from '../../assets/icons'

class DrawerCustom extends Component {
  constructor() {
    super()
    this.state = {
      loggedUser: session.getLocalUser()
    }
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
          <Link to="/v2/">
            <MenuItem
              primaryText="Inicio"
              leftIcon={<HomeIcon />}
            />
          </Link>
          <Link to="/v2/winners">
            <MenuItem
              primaryText="Ganadores"
              leftIcon={<WinnersIcon />}
            />
          </Link>
          <Link to="/v2/prizes">
            <MenuItem
              primaryText="Premios"
              leftIcon={<PrizesIcon />}
            />
          </Link>
          {(this.state.loggedUser && this.state.loggedUser.role === 'admin') ?
            <Link to="/v2/users">
              <MenuItem
                primaryText="Usuarios"
                leftIcon={<AcountsIcon />}
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
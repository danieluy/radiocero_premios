import React, { Component } from 'react';
import './Drawer.scss'

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

import { AcountsIcon, WinnersIcon, PrizesIcon, HomeIcon } from '../../assets/icons'

class DrawerCustom extends Component {
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
            <img className="drawer-header-icon" src="../assets/img/icon_48.png" />
            Radiocero Premios v2
          </div>
          <MenuItem
            primaryText="Inicio"
            leftIcon={<HomeIcon />}
          />
          <MenuItem
            primaryText="Ganadores"
            leftIcon={<WinnersIcon />}
          />
          <MenuItem
            primaryText="Premios"
            leftIcon={<PrizesIcon />}
          />
          <MenuItem
            primaryText="Usuarios"
            leftIcon={<AcountsIcon />}
          />
        </Drawer>
      </div>
    );
  }
}

export default DrawerCustom;
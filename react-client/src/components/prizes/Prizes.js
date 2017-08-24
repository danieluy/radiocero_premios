import React, { PureComponent } from 'react';

import { getUsers } from '../../radiocero-api'
import events from '../../events'

import { PrizesIcon } from '../../assets/icons'

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class Users extends PureComponent {
  constructor() {
    super()
    this.state = {
      prizes: []
    }
  }
  componentDidMount() {
    this.updatePrizes()
    events.on('login', this.updatePrizes.bind(this))
  }

  updatePrizes() {
    getPrizes()
      .then(prizes => {
        this.setState({
          prizes: prizes
        })
        this.resetModals()
        this.props.onQuickNotice('Premios actualizados')
      })
      .catch(err => {
        console.error(err)
      })
  }
  resetModals() {
    console.log('Prizes.resetModals()')
    // this.setState({
    //   userToEdit: null,
    //   userToDelete: null,
    //   userToEditPassowrd: null,
    //   addUserOpen: false
    // })
  }

  render() {
    console.log(this.state.prizes)
    return (
      <div className="app-container">
        <List>
          <Subheader>Premios</Subheader>
          <Paper zDepth={1}>
            {this.state.prizes.map((prize, i) => {
              return (
                <div key={i}>
                  <ListItem
                    className="prizes-item"
                    leftAvatar={<PrizesIcon width="30px" fill="#888" />}
                    primaryText={prize.description}
                    secondaryTextLines={2}
                    secondaryText={
                      <p>
                        <span>{prize.sponsor}</span><br />
                        {prize.email && prize.email !== '' ?
                          <a
                            href={`mailto:${prize.email}?subject=Radiocero%20Premios`}
                            target="_blank"
                            className="users-item-link"
                          >
                            {prize.email}
                          </a>
                          : null
                        }
                      </p>
                    }
                  /*rightIconButton={
                    <IconMenu iconButtonElement={
                      <IconButton
                        touch={true}
                        tooltip="Opciones"
                        tooltipPosition="bottom-left"
                      >
                        <MoreVertIcon color={'#888'} />
                      </IconButton>
                    }>
                      <MenuItem onClick={this.openEditUser.bind(this, user)}>Editar</MenuItem>
                      <MenuItem onClick={this.openEditPassword.bind(this, user)}>Contraseña </MenuItem>
                      <MenuItem onClick={this.openDeleteUser.bind(this, user)}>Borrar</MenuItem>
                    </IconMenu>
                  }*/
                  />
                  <Divider />
                </div>
              )
            })}
          </Paper>
        </List>
      </div>
    )
  }
}

export default Users;
import React, { Component } from 'react';

import { getUsers } from '../../radiocero-api'

import EditUserForm from './EditUserForm'

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

class Users extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      userToEdit: null
    }
  }
  componentDidMount() {
    this.updateUsers()
  }

  updateUsers() {
    getUsers()
      .then(users => {
        this.setState({
          users: users,
          userToEdit: null
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  openEditUser(user) {
    this.setState({
      userToEdit: user
    })
  }

  render() {
    return (
      <div>

        <List>
          <Subheader>Usuarios</Subheader>
          {this.state.users.map((user, i) => {
            return (
              <Paper zDepth={1} key={i}>
                <ListItem
                  leftAvatar={<Avatar>{user.userName ? user.userName.slice(0, 1).toUpperCase() : null}</Avatar>}
                  primaryText={user.userName}
                  secondaryTextLines={2}
                  disabled={true}
                  secondaryText={
                    <p>
                      <span>{user.role}</span><br />
                      {user.email}
                    </p>
                  }
                  rightIconButton={
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
                      <MenuItem>Borrar</MenuItem>
                    </IconMenu>
                  }
                />
                <Divider />
              </Paper>
            )
          })}
        </List>

        <EditUserForm
          user={this.state.userToEdit}
          onEditSuccess={this.updateUsers.bind(this)}
        />

      </div>
    )
  }
}

export default Users;
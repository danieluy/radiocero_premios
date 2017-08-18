import React, { Component } from 'react';

import { getUsers } from '../../radiocero-api'

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

class Users extends Component {
  constructor() {
    super()
    this.state = {
      users: [1, 2]
    }
  }
  componentDidMount() {
    getUsers()
      .then(users => {
        this.setState({
          users: users
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    return (
      <List>
        <Subheader>Usuarios</Subheader>
        {this.state.users.map((user, i) => {
          return (
            <Paper zDepth={1}>
              <ListItem
                key={i}
                leftAvatar={<Avatar>{user.userName}</Avatar>}
                primaryText={user.userName}
                secondaryTextLines={2}
                disabled={true}
                secondaryText={
                  <p>
                    <span style={{ color: darkBlack }}>{user.role}</span><br />
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
                      <MoreVertIcon color={grey400} />
                    </IconButton>
                  }>
                    <MenuItem>Borrar</MenuItem>
                    <MenuItem>Editar</MenuItem>
                  </IconMenu>
                }
              />
              <Divider />
            </Paper>
          )
        })}
      </List>
    )
  }
}

export default Users;
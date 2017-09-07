import React, { PureComponent } from 'react';

import { getUsers } from '../../radiocero-api'
import events from '../../events'

import EditUserForm from './EditUserForm'
import DeleteUserForm from './DeleteUserForm'
import EditPasswordForm from './EditPasswordForm'
import AddUserForm from './AddUserForm'

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
      users: [],
      userToEdit: null,
      userToDelete: null,
      userToEditPassowrd: null,
      addUserOpen: false
    }
  }
  componentDidMount() {
    this.updateUsers()
    events.on('login', this.updateUsers.bind(this))
  }

  updateUsers() {
    getUsers()
      .then(users => {
        this.setState({
          users: users
        })
        this.resetModals()
        this.props.onQuickNotice('Usuarios actualizados')
      })
      .catch(err => {
        console.error(err)
      })
  }
  resetModals() {
    this.setState({
      userToEdit: null,
      userToDelete: null,
      userToEditPassowrd: null,
      addUserOpen: false
    })
  }
  openEditUser(user) {
    this.setState({
      userToEdit: user
    })
  }
  openEditPassword(user) {
    this.setState({
      userToEditPassowrd: user
    })
  }
  openDeleteUser(user) {
    this.setState({
      userToDelete: user
    })
  }
  openAddUser() {
    this.setState({
      addUserOpen: true
    })
  }

  render() {
    return (
      <div className="app-container">
        <List>
          <Subheader>Usuarios</Subheader>
          <Paper zDepth={1}>
            {this.state.users.map((user, i) => {
              return (
                <div key={i}>
                  <ListItem
                    className="users-item"
                    leftAvatar={<Avatar>{user.userName ? user.userName.slice(0, 1).toUpperCase() : null}</Avatar>}
                    primaryText={user.userName}
                    secondaryTextLines={2}
                    disabled={true}
                    secondaryText={
                      <p>
                        <span>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span><br />
                        {user.email && user.email !== '' ?
                          <a
                            href={`mailto:${user.email}?subject=Radiocero%20Premios`}
                            target="_blank"
                            className="users-item-link"
                            >
                            {user.email}
                          </a>
                          : null
                        }
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
                        <MenuItem onClick={this.openEditPassword.bind(this, user)}>Contraseña </MenuItem>
                        <MenuItem onClick={this.openDeleteUser.bind(this, user)}>Borrar</MenuItem>
                      </IconMenu>
                    }
                  />
                  <Divider />
                </div>
              )
            })}
          </Paper>
        </List>

        <EditUserForm
          user={this.state.userToEdit}
          onActionSuccess={this.updateUsers.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <DeleteUserForm
          user={this.state.userToDelete}
          onActionSuccess={this.updateUsers.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <EditPasswordForm
          user={this.state.userToEditPassowrd}
          onActionSuccess={this.updateUsers.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <AddUserForm
          open={this.state.addUserOpen}
          onActionSuccess={this.updateUsers.bind(this)}
          onActionCanceled={this.resetModals.bind(this)}
        />

        <FloatingActionButton
          style={{ position: 'fixed', bottom: '10px', right: '10px' }}
          secondary={true}
          onClick={this.openAddUser.bind(this)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Users;
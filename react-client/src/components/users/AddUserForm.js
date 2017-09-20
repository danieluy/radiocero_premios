import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { addUser } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

class AddUserForm extends Component {
  constructor() {
    super()
    this.state = {
      user: {
        userName: null,
        userNameMessage: null,
        role: null,
        roleMessage: null,
        email: null,
        emailMessage: null,
        password: null,
        passwordMessage: null,
        passwordMatch: null,
        passwordMatchMessage: null
      },
      loggedUser: session.getLocalUser()
    }
  }
  updateUserName(e) {
    const newUser = this.state.user
    newUser.userName = e.target.value
    newUser.userNameMessage = null
    this.setState({ newUser })
  }
  updateRole(e, index, value) {
    const newUser = this.state.user
    newUser.role = value
    newUser.roleMessage = null
    this.setState({ newUser })
  }
  updateEmail(e) {
    const newUser = this.state.user
    newUser.email = e.target.value
    newUser.emailMessage = null
    this.setState({ newUser })
  }
  updatePasswordNew(e) {
    const newUser = this.state.user
    newUser.password = e.target.value
    newUser.passwordMessage = null
    this.setState({ newUser })
  }
  updatePasswordMatch(e) {
    const newUser = this.state.user
    newUser.passwordMatch = e.target.value
    newUser.passwordMatchMessage = null
    this.setState({ newUser })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.editUser()
  }
  addUser() {
    const newUser = this.state.user
    if (!newUser.userName || newUser.userName === '')
      newUser.userNameMessage = 'Este campo es obligatorio'
    if (!newUser.role)
      newUser.roleMessage = 'Seleccione los permisos de Usuario'
    if (newUser.email && newUser.userName !== '' && !newUser.email.match(/\S+@\S+\.\S+/))
      newUser.emailMessage = 'Este campo solo acepta un email'
    if (!newUser.password || newUser.password === '')
      newUser.passwordMessage = 'Este campo es obligatorio'
    if (!newUser.passwordMatch || newUser.passwordMatch === '')
      newUser.passwordMatchMessage = 'Este campo es obligatorio'
    if (newUser.password !== newUser.passwordMatch)
      newUser.passwordMatchMessage = 'Las contraseñas no coinciden'
    if (newUser.userNameMessage || newUser.roleMessage || newUser.emailMessage || newUser.passwordMessage || newUser.passwordMatchMessage)
      this.setState({ newUser })
    else {
      delete newUser.userNameMessage
      delete newUser.roleMessage
      delete newUser.emailMessage
      delete newUser.passwordMessage
      delete newUser.passwordMatchMessage
      newUser.name = newUser.userName // The backend expects a parameter "name"
      addUser(newUser)
        .then(res => {
          this.props.onActionSuccess()
          this.handleClose()
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  handleClose() {
    this.props.onActionCanceled()
  }

  toggleHidePasswords() {
    this.setState({
      showPasswords: !this.state.showPasswords
    });
  }

  render() {
    return (
      <Dialog
        title="Nuevo Usuario"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}
        contentStyle={styles.dialog}
        autoScrollBodyContent={true}
      >
        <TextField
          hintText="Nombre de usuario sin espacios"
          errorText={this.state.user.userNameMessage}
          floatingLabelText="Nombre de Usuario"
          value={this.state.user.userName || ''}
          onChange={this.updateUserName.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <br />
        <SelectField
          floatingLabelText="Permisos"
          value={this.state.user.role}
          onChange={this.updateRole.bind(this)}
          errorText={this.state.user.roleMessage}
          disabled={(this.state.loggedUser && this.state.loggedUser.role === 'admin') ? false : true}
        >
          <MenuItem value={'user'} primaryText="Usuario" />
          <MenuItem value={'admin'} primaryText="Administrador" />
        </SelectField>
        <br />
        <TextField
          hintText="nombre@dominio.com.uy"
          errorText={this.state.user.emailMessage}
          floatingLabelText="Email"
          value={this.state.user.email || ''}
          onChange={this.updateEmail.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <br />
        <TextField
          hintText="Ingrese una contraseña"
          errorText={this.state.user.passwordMessage}
          floatingLabelText="Contraseña"
          value={this.state.user.password || ''}
          onChange={this.updatePasswordNew.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          type={this.state.showPasswords ? null : "password"}
        />
        <br />
        <TextField
          hintText="Repita la contraseña"
          errorText={this.state.user.passwordMatchMessage}
          floatingLabelText="Repetir Contraseña"
          value={this.state.user.passwordMatch || ''}
          onChange={this.updatePasswordMatch.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          type={this.state.showPasswords ? null : "password"}
        />
        <br />
        <br />
        <Checkbox
          checkedIcon={<Visibility />}
          uncheckedIcon={<VisibilityOff style={{ fill: styles.color.grey500 }} />}
          label="Mostrar Contraseñas"
          checked={this.state.showPasswords}
          onCheck={(this.toggleHidePasswords.bind(this))}
        />
        <br />
        <br />
        <br />
        <RaisedButton
          onClick={this.addUser.bind(this)}
          label="Guardar"
          primary={true}
        />
        <FlatButton
          onClick={this.handleClose.bind(this)}
          label="Cancelar"
          style={{ marginLeft: '5px' }}
        />
        {/* <pre>
          {JSON.stringify(this.state.user, null, 2)}
        </pre> */}
      </Dialog>
    )
  }
}

export default AddUserForm;
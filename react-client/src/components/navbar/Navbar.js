import React, { Component } from 'react'

import session from '../../session'

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Navbar extends Component {
  constructor() {
    super()
    this.state = {
      openLogin: false,
      loginForm: {
        userName: null,
        userNameError: null,
        password: null,
        passwordError: null
      }
    }
  }
  checkLoggedUser() {
    if (this.props.loggedUser)
      return <FlatButton label="Logout" />
    else
      return <FlatButton onClick={this.openCloseLogin.bind(this)} label="Login" />
  }
  openCloseLogin() {
    this.setState({
      openLogin: !this.state.openLogin
    })
  }
  setInputUserName(evt) {
    const formData = this.state.loginForm
    formData.userName = evt.target.value
    this.setState({ loginForm: formData })
  }
  setInputPassword(evt) {
    const formData = this.state.loginForm
    formData.password = evt.target.value
    this.setState({ loginForm: formData })
  }
  login() {
    session.login(this.state.loginForm.userName, this.state.loginForm.password)
    this.openCloseLogin()
  }
  render() {
    return (
      <div>
        <AppBar
          title="Radiocero Premios v2"
          iconElementRight={this.checkLoggedUser.call(this)}
        />
        <Dialog
          title="Iniciar Sesión"
          modal={false}
          open={this.state.openLogin}
          onRequestClose={this.openCloseLogin.bind(this)}
        >
          <TextField
            hintText="Ingresa tu nombre de usuario"
            errorText={this.state.loginForm.userNameError}
            floatingLabelText="Usuario"
            onChange={this.setInputUserName.bind(this)}
          />
          <br />
          <TextField
            hintText="Ingresa tu contraseña"
            errorText={this.state.loginForm.userNameError}
            floatingLabelText="Contraseña"
            onChange={this.setInputPassword.bind(this)}
            type="password"
          />
          <br />
          <RaisedButton onClick={this.login.bind(this)} label="Login" primary={true} />
        </Dialog>
      </div>
    )
  }
}

export default Navbar
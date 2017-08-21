import React, { Component } from 'react'

import session from '../../session'

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

class Navbar extends Component {
  constructor() {
    super()
    this.state = {
      openLogin: false,
      loginForm: {
        userName: null,
        userNameMessage: null,
        password: null,
        passwordMessage: null
      }
    }
  }
  checkLoggedUser() {
    if (this.props.loggedUser)
      return (
        // <FlatButton label="Cerrar Sesión">
        //   {this.props.loggedUser.userName}
        // </FlatButton>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem primaryText={this.props.loggedUser.userName} style={{ fontWeight: '700' }} />
          <MenuItem onClick={this.logout} primaryText="Cerrar Sesión" />
        </IconMenu>
      )
    else
      return <FlatButton onClick={this.openCloseLogin.bind(this)} label="Iniciar Sesión" />
  }
  openCloseLogin() {
    this.setState({
      openLogin: !this.state.openLogin
    })
  }
  setInputUserName(evt) {
    const formData = this.state.loginForm
    formData.userName = evt.target.value
    formData.userNameMessage = null
    this.setState({ loginForm: formData })
  }
  setInputPassword(evt) {
    const formData = this.state.loginForm
    formData.password = evt.target.value
    formData.passwordMessage = null
    this.setState({ loginForm: formData })
  }
  login() {
    const formData = this.state.loginForm
    if (!formData.userName || formData.userName === '')
      formData.userNameMessage = 'Este campo es obligatorio'
    if (!formData.password || formData.password === '')
      formData.passwordMessage = 'Este campo es obligatorio'
    if (formData.userNameMessage || formData.passwordMessage)
      this.setState({
        loginForm: formData
      })
    else {
      session.login(formData.userName, formData.password)
      this.openCloseLogin()
    }
  }
  logout() {
    session.logout()
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.login()
  }
  render() {
    return (
      <div>
        <AppBar
          title="Radiocero Premios v2"
          iconElementRight={this.checkLoggedUser.call(this)}
          onLeftIconButtonTouchTap={this.props.toggleDrawer}
        />
        <Dialog
          title="Iniciar Sesión"
          modal={false}
          open={this.state.openLogin}
          onRequestClose={this.openCloseLogin.bind(this)}
        >
          <TextField
            hintText="Ingresa tu nombre de usuario"
            errorText={this.state.loginForm.userNameMessage}
            floatingLabelText="Usuario"
            onChange={this.setInputUserName.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          //onKeyPress={this.handleKeyPress.bind(this)}
          />
          <br />
          <TextField
            hintText="Ingresa tu contraseña"
            errorText={this.state.loginForm.passwordMessage}
            floatingLabelText="Contraseña"
            onChange={this.setInputPassword.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            //onKeyPress={this.handleKeyPress.bind(this)}
            type="password"
          />
          <br />
          <br />
          <br />
          <RaisedButton onClick={this.login.bind(this)} label="Entrar" primary={true} />
        </Dialog>
      </div>
    )
  }
}

export default Navbar
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class EditUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.state.user)
      this.setState({
        user: nextProps.user
      })
  }
  componentDidMount() {
    if (this.props.user)
      this.setState({
        user: {
          id: this.props.user.id,
          idMessage: null,
          userName: this.props.user.userName,
          userNameMessage: null,
          role: this.props.user.role,
          roleMessage: null,
          email: this.props.user.email,
          emailMessage: null,
          set_date: this.props.user.set_date,
          set_dateMessage: null
        }
      })
  }
  updateUserName(e) {
    const user = this.state.user
    user.userName = e.target.value
    user.userNameMessage = null
    this.setState({ user })
  }
  updateRole(e, index, value) {
    const user = this.state.user
    user.role = value
    user.roleMessage = null
    this.setState({ user })
  }
  updateEmail(e) {
    const user = this.state.user
    user.email = e.target.value
    user.emailMessage = null
    this.setState({ user })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      console.log('Enter pressed')
  }
  render() {
    if (this.state.user)
      return (
        <Dialog
          title="Iniciar Sesión"
          modal={false}
          open={!!this.state.user}
          onRequestClose={() => { this.setState({ user: null }) }}
        >
          <TextField
            hintText="Nombre de usuario"
            errorText={this.state.userNameMessage}
            floatingLabelText="Usuario"
            value={this.state.user.userName}
            onChange={this.updateUserName.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <br />
          <SelectField
            floatingLabelText="Permisos"
            value={this.state.user.role}
            onChange={this.updateRole.bind(this)}
            errorText={this.state.roleMessage}
          >
            <MenuItem value={'user'} primaryText="Usuario" />
            <MenuItem value={'admin'} primaryText="Administrador" />
          </SelectField>
          <br />
          <TextField
            hintText="Correo electrónico"
            errorText={this.state.emailMessage}
            floatingLabelText="Email"
            value={this.state.user.email}
            onChange={this.updateEmail.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <br />
          <br />
          <br />
          <RaisedButton
            //onClick={this.login.bind(this)}
            label="Guardar"
            primary={true}
          />
          <pre>
            {JSON.stringify(this.state.user, null, 4)}
          </pre>
        </Dialog>
      );
    return null;
  }
}

export default EditUserForm;


EditUserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    userName: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    set_date: PropTypes.number
  })
};
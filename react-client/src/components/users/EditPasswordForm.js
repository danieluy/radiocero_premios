import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { updateUserPassword } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

class EditPasswordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      editForm: null,
      loggedUser: session.getLocalUser(),
      showPasswords: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.state.user)
      this.setState({
        originalRole: nextProps.user.role,
        editForm: nextProps.user
      })
  }
  componentDidMount() {
    if (this.props.editForm)
      this.setState({
        editForm: {
          id: this.props.user.id,
          idMessage: null,
          userName: this.props.user.userName,
          userNameMessage: null,
          role: this.props.user.role,
          roleMessage: null,
          email: this.props.user.email,
          emailMessage: null,
          set_date: this.props.user.set_date,
          set_dateMessage: null,
          passwordNew: null,
          passwordNewMessage: null,
          passwordMatch: null,
          passwordMatchMessage: null
        }
      })
  }
  updatePasswordNew(e) {
    const editForm = this.state.editForm
    editForm.passwordNew = e.target.value
    editForm.passwordNewMessage = null
    this.setState({ editForm })
  }
  updatePasswordMatch(e) {
    const editForm = this.state.editForm
    editForm.passwordMatch = e.target.value
    editForm.passwordMatchMessage = null
    this.setState({ editForm })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.editPassword()
  }
  editPassword() {
    const editForm = this.state.editForm
    if (!editForm.passwordNew || editForm.passwordNew === '')
      editForm.passwordNewMessage = 'Este campo es obligatorio'
    if (!editForm.passwordMatch || editForm.passwordMatch === '')
      editForm.passwordMatchMessage = 'Este campo es obligatorio'
    if (editForm.passwordNew !== editForm.passwordMatch)
      editForm.passwordMatchMessage = 'Las contraseñas no coinciden'
    if (editForm.passwordNewMessage || editForm.passwordMatchMessage)
      this.setState({ editForm })
    else {
      delete editForm.idMessage
      delete editForm.userNameMessage
      delete editForm.role
      delete editForm.roleMessage
      delete editForm.email
      delete editForm.emailMessage
      delete editForm.set_date
      delete editForm.set_dateMessage
      delete editForm.passwordNewMessage
      delete editForm.passwordMatchMessage
      updateUserPassword(editForm)
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
    this.setState({ editForm: null })
    this.props.onActionCanceled()
  }

  toggleHidePasswords() {
    this.setState({
      showPasswords: !this.state.showPasswords
    });
  }

  render() {
    if (this.state.editForm)
      return (
        <Dialog
          title="Cambiar Contraseña"
          modal={false}
          open={!!this.state.editForm}
          onRequestClose={this.handleClose.bind(this)}
          contentStyle={styles.dialog}
        >
          <TextField
            hintText="Ingrese una nueva contraseña"
            errorText={this.state.editForm.passwordNewMessage}
            floatingLabelText="Nueva Contraseña"
            value={this.state.editForm.passwordNew || ''}
            onChange={this.updatePasswordNew.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            type={this.state.showPasswords ? null : "password"}
          />
          <br />
          <TextField
            hintText="Repita la nueva contraseña"
            errorText={this.state.editForm.passwordMatchMessage}
            floatingLabelText="Repetir Contraseña"
            value={this.state.editForm.passwordMatch || ''}
            onChange={this.updatePasswordMatch.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            type={this.state.showPasswords ? null : "password"}
          />
          <br />
          <br />
          <Checkbox
            checkedIcon={<Visibility />}
            uncheckedIcon={<VisibilityOff />}
            label="Mostrar Contraseñas"
            checked={this.state.showPasswords}
            onCheck={(this.toggleHidePasswords.bind(this))}
          />
          <br />
          <br />
          <br />
          <RaisedButton
            onClick={this.editPassword.bind(this)}
            label="Guardar"
            primary={true}
          />
          <FlatButton
            onClick={this.handleClose.bind(this)}
            label="Cancelar"
            style={{ marginLeft: '5px' }}
          />
        </Dialog>
      );
    return null;
  }
}

export default EditPasswordForm;


EditPasswordForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    userName: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
    set_date: PropTypes.number
  })
};
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { updateUser } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class EditUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      editForm: null,
      loggedUser: session.getLocalUser()
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
          set_dateMessage: null
        }
      })
  }
  updateRole(e, index, value) {
    const editForm = this.state.editForm
    editForm.role = value
    editForm.roleMessage = null
    this.setState({ editForm })
  }
  updateEmail(e) {
    const editForm = this.state.editForm
    editForm.email = e.target.value
    editForm.emailMessage = null
    this.setState({ editForm })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.editUser()
  }
  editUser() {
    const editForm = this.state.editForm
    if (editForm.email && editForm.userName !== '' && !editForm.email.match(/\S+@\S+\.\S+/))
      editForm.emailMessage = 'Este campo solo acepta un email'
    if (editForm.emailMessage)
      this.setState({ editForm })
    else {
      delete editForm.idMessage
      delete editForm.userNameMessage
      delete editForm.roleMessage
      delete editForm.emailMessage
      delete editForm.set_dateMessage
      updateUser(editForm)
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

  render() {
    if (this.state.editForm)
      return (
        <Dialog
          title="Editar Usuario"
          modal={false}
          open={!!this.state.editForm}
          onRequestClose={this.handleClose.bind(this)}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <SelectField
            floatingLabelText="Permisos"
            value={this.state.editForm.role}
            onChange={this.updateRole.bind(this)}
            errorText={this.state.editForm.roleMessage}
            disabled={(this.state.loggedUser && this.state.loggedUser.role === 'admin') ? false : true}
          >
            <MenuItem value={'user'} primaryText="Usuario" />
            <MenuItem value={'admin'} primaryText="Administrador" />
          </SelectField>
          <br />
          <TextField
            hintText="nombre@dominio.com.uy"
            errorText={this.state.editForm.emailMessage}
            floatingLabelText="Email"
            value={this.state.editForm.email || ''}
            onChange={this.updateEmail.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <br />
          <br />
          <br />
          <RaisedButton
            onClick={this.editUser.bind(this)}
            label="Guardar"
            primary={true}
          />
          <FlatButton
            onClick={this.handleClose.bind(this)}
            label="Cancelar"
            style={{ marginLeft: '5px' }}
          />
          {/* <pre>
            {JSON.stringify(this.state.editForm, null, 4)}
          </pre> */}
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
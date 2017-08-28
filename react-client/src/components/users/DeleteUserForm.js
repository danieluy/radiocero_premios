import React, { Component } from 'react';

import { deleteUser } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class DeleteUserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      loggedUser: session.getLocalUser()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.state.user)
      this.setState({ user: nextProps.user })
  }
  deleteUser() {
    deleteUser(this.state.user)
      .then(res => {
        this.props.onActionSuccess()
        this.handleClose()
      })
      .catch(err => {
        console.error(err)
      })
  }
  handleClose() {
    this.setState({ user: null })
    this.props.onActionCanceled()
  }
  render() {
    if (this.state.user) {
      const actions = [
        <FlatButton
          label="Eliminar"
          onClick={this.deleteUser.bind(this)}
        />,
        <RaisedButton
          label="Cancelar"
          primary={true}
          onClick={this.handleClose.bind(this)}
          style={{ marginLeft: '5px' }}
        />,
      ];
      return (
        <Dialog
          title={`Eliminar usuario ${this.state.user.userName}?`}
          actions={actions}
          modal={false}
          open={!!this.state.user}
          onRequestClose={this.handleClose.bind(this)}
          contentStyle={styles.dialog}
          autoScrollBodyContent={true}
        >
          <p>Esta acción NO se puede deshacer</p>
        </Dialog>
      );
    }
    return null;
  }
}

export default DeleteUserForm;
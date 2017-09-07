import React, { Component } from 'react';

import { deletePrize } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class DeleteDeleteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prize: null,
      loggedUser: session.getLocalUser()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.prize !== this.state.prize)
      this.setState({ prize: nextProps.prize })
  }
  deletePrize() {
    deletePrize(this.state.prize)
      .then(res => {
        this.props.onActionSuccess()
        this.handleClose.call(this)
      })
      .catch(err => {
        console.error(err)
      })
  }
  handleClose() {
    this.setState({ prize: null })
    this.props.onActionCanceled()
  }
  render() {
    if (this.state.prize) {
      const actions = [
        <FlatButton
          label="Eliminar"
          onClick={this.deletePrize.bind(this)}
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
          title={`Eliminar premio ${this.state.prize.description}?`}
          actions={actions}
          modal={false}
          open={!!this.state.prize}
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

export default DeleteDeleteForm;
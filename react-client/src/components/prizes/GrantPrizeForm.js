import React, { Component } from 'react';

import styles from '../../assets/styles'

import { grantPrize } from '../../radiocero-api'
console.log(grantPrize)

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class GrantPrizeForm extends Component {
  handleClose() {
    this.props.onActionCanceled()
  }
  grantPrize(prizeId) {
    grantPrize(prizeId)
      .then(() => {
        console.log('Pseudo-Granted', prizeId)
        this.props.onActionSuccess()
      })
  }
  render() {
    return (
      <Dialog
        title="Otorgar Premio"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}
        contentStyle={styles.dialog}
        autoScrollBodyContent={true}
      >
        GrantPrizeForm Component
        <RaisedButton
          label="Otorgar"
          primary={true}
          onClick={this.grantPrize.bind(this, this.props.prizeId)}
        />
        {/* <pre>
          {JSON.stringify(this.state.prizeToEdit, null, 2)}
        </pre> */}
      </Dialog>
    );
  }
}

export default GrantPrizeForm;
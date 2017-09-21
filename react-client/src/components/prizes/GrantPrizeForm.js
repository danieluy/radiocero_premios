import React, { Component } from 'react';

import styles from '../../assets/styles'

import { grantPrize, checkWinner } from '../../radiocero-api'
import { validateCi } from '../../local-utils'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

class GrantPrizeForm extends Component {
  constructor() {
    super()
    this.state = {
      winner: {
        ci: null,
        ciMessage: null,
        name: null,
        nameMessage: null,
        lastname: null,
        lastnameMessage: null
      },
      checkingWinner: false
    }
  }
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
  updateWinnerCi(evt) {
    const winner = Object.assign({}, this.state.winner)
    const ci = evt.target.value
    const isValid = validateCi(ci)
    if (!isValid) {
      winner.ci = ci
      winner.ciMessage = 'Cédula inválida'
      this.setState({ winner })
    }
    else {
      this.setState({ checkingWinner: true })
      checkWinner(ci)
        .then(result => {
          this.setState({ checkingWinner: false })
          console.log(result)
          if (result.allowed && !result.winner) {
            winner.ci = ci
            winner.ciMessage = null
            this.props.onQuickNotice('Participante habilitado')
            this.setState({ winner })
          }
          else if (result.allowed) {
            winner.ci = ci
            winner.ciMessage = null
            this.props.onQuickNotice('Habilitado, ha ganado hace más de 3 meses')
            this.setState({ winner })
          }
          else {
            winner.ci = ci
            winner.ciMessage = 'Participante no habilitado'
            this.props.onQuickNotice('No habilitado, ha ganado hace menos de 3 meses')
            this.setState({ winner })
          }
        })
        .catch(err => { console.error(err) })
    }
  }
  updateWinnerName(evt) {
    const winner = Object.assign({}, this.state.winner)
    winner.name = evt.target.value
    winner.nameMessage = null
    this.setState({ winner })
  }
  updateWinnerLastname(evt) {
    const winner = Object.assign({}, this.state.winner)
    winner.lastname = evt.target.value
    winner.lastnameMessage = null
    this.setState({ winner })
  }
  handleKeyPress(evt) {
    console.log(evt.target.value)
  }
  render() {
    return (
      <Dialog
        title="Otorgar Premio a:"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}
        contentStyle={styles.dialog}
        autoScrollBodyContent={true}
      >
        <TextField
          hintText="C.I. sin puntos ni guiones"
          errorText={this.state.winner.ciMessage}
          floatingLabelText="C.I."
          value={this.state.winner.ci || ''}
          onChange={this.updateWinnerCi.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        {this.state.checkingWinner ? <CircularProgress size={15} /> : null}
        <br />
        <TextField
          hintText="Nombre"
          errorText={this.state.winner.nameMessage}
          floatingLabelText="Nombre"
          value={this.state.winner.name || ''}
          onChange={this.updateWinnerName.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        <br />
        <TextField
          hintText="Apellido"
          errorText={this.state.winner.lastnameMessage}
          floatingLabelText="Apellido"
          value={this.state.winner.lastname || ''}
          onChange={this.updateWinnerLastname.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        <br />


        <br />
        <br />
        <RaisedButton
          label="Otorgar"
          primary={true}
          onClick={this.grantPrize.bind(this, this.props.prizeId)}
        />
        <pre>
          {JSON.stringify(this.state.winner, null, 2)}
        </pre>
      </Dialog>
    );
  }
}

export default GrantPrizeForm;
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from '../../assets/styles'

import { grantPrize, checkWinner } from '../../radiocero-api'
import { validateCi } from '../../local-utils'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';



class GrantPrizeForm extends Component {
  constructor(props) {
    super()
    this.state = {
      prizeId: props.prizeId,
      winner: {
        ci: null,
        ciMessage: null,
        name: null,
        nameMessage: null,
        lastname: null,
        lastnameMessage: null,
        facebook: null,
        facebookMessage: null,
        gender: null,
        genderMessage: null,
        phone: null,
        phoneMessage: null,
        mail: null,
        mailMessage: null
      },
      checkingWinner: false
    }
  }
  handleClose() {
    this.props.onActionCanceled()
  }
  grantPrize() {
    grantPrize(this.state.prizeId)
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
        .catch(err => {
          this.setState({ checkingWinner: false })
          this.props.onQuickNotice('ERROR verificando C.I.')
          console.error(err)
        })
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
  updateWinnerGender(e, index, value) {
    const winner = Object.assign({}, this.state.winner)
    winner.gender = value
    winner.genderMessage = null
    this.setState({ winner })
  }
  updateWinnerFacebook(evt) {
    const winner = Object.assign({}, this.state.winner)
    winner.facebook = evt.target.value
    winner.facebookMessage = null
    this.setState({ winner })
  }
  updateWinnerPhone(evt) {
    const winner = Object.assign({}, this.state.winner)
    winner.phone = evt.target.value
    winner.phoneMessage = null
    this.setState({ winner })
  }
  updateWinnerMail(evt) {
    const winner = Object.assign({}, this.state.winner)
    winner.mail = evt.target.value
    winner.mailMessage = null
    this.setState({ winner })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.grantPrize()
  }
  grantPrize() {
    grantPrize(this.state.prizeId)
      .then(() => {
        console.log('Pseudo-Granted', prizeId)
        this.props.onActionSuccess()
      })
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
        <SelectField
          floatingLabelText="Sexo"
          value={this.state.winner.gender}
          onChange={this.updateWinnerGender.bind(this)}
          errorText={this.state.winner.genderMessage}
          fullWidth={true}
        >
          <MenuItem value={'F'} primaryText="Femenino" />
          <MenuItem value={'M'} primaryText="Masculino" />
          <MenuItem value={'O'} primaryText="Otro" />
        </SelectField>
        <br />
        <TextField
          hintText="Perfil de Facebook"
          errorText={this.state.winner.facebookMessage}
          floatingLabelText="Facebook"
          value={this.state.winner.facebook || ''}
          onChange={this.updateWinnerFacebook.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        <br />
        <TextField
          hintText="099 111 222"
          errorText={this.state.winner.phoneMessage}
          floatingLabelText="Teléfono"
          value={this.state.winner.phone || ''}
          onChange={this.updateWinnerPhone.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        <br />
        <TextField
          hintText="usuario@dominio.com.uy"
          errorText={this.state.winner.mailMessage}
          floatingLabelText="Email"
          value={this.state.winner.mail || ''}
          onChange={this.updateWinnerMail.bind(this)}
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

GrantPrizeForm.PropTypes = {
  prizeId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onActionSuccess: PropTypes.func.isRequired,
  onActionCanceled: PropTypes.func.isRequired,
  onQuickNotice: PropTypes.func.isRequired
}
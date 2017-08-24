import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { addPrize } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';

class AddPrizeForm extends Component {
  constructor() {
    super()
    this.state = {
      newPrize: {
        type: null,
        typeMessage: null,
        sponsor: null,
        sponsorMessage: null,
        description: null,
        descriptionMessage: null,
        stock: null,
        stockMessage: null,
        periodic: null,
        periodicMessage: null,
        due_date: null,
        due_dateMessage: null,
        note: null,
        noteMessage: null,
        total_handed: null,
        total_handedMessage: null,
      },
      loggedUser: session.getLocalUser()
    }
  }
  updatePrizeDescrption(e) {
    const newPrize = this.state.newPrize
    newPrize.description = e.target.value
    newPrize.descriptionMessage = null
    this.setState({ newPrize })
  }
  updatePrizeType(searchText) {
    const newPrize = this.state.newPrize
    newPrize.description = searchText
    newPrize.descriptionMessage = null
    this.setState({ newPrize })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.addPrize()
  }
  addPrize() {
    const newPrize = this.state.newPrize
    if (!newPrize.description || newPrize.description === '')
      newPrize.descriptionMessage = 'Este campo es obligatorio'
    // if (!newPrize.role)
    //   newPrize.roleMessage = 'Seleccione los permisos de Usuario'
    // if (newPrize.email && newPrize.userName !== '' && !newPrize.email.match(/\S+@\S+\.\S+/))
    //   newPrize.emailMessage = 'Este campo solo acepta un email'
    // if (!newPrize.password || newPrize.password === '')
    //   newPrize.passwordMessage = 'Este campo es obligatorio'
    // if (!newPrize.passwordMatch || newPrize.passwordMatch === '')
    //   newPrize.passwordMatchMessage = 'Este campo es obligatorio'
    // if (newPrize.password !== newPrize.passwordMatch)
    //   newPrize.passwordMatchMessage = 'Las contraseñas no coinciden'
    if (false)
      this.setState({ newPrize })
    else {
      // delete newPrize.userNameMessage
      // delete newPrize.roleMessage
      // delete newPrize.emailMessage
      // delete newPrize.passwordMessage
      // delete newPrize.passwordMatchMessage
      addPrize(newPrize)
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
    this.props.onActionCanceled()
  }

  toggleHidePasswords() {
    this.setState({
      showPasswords: !this.state.showPasswords
    });
  }

  prizeTypes() {
    return this.props.prizes.reduce((types, prize) => {
      let found = false;
      for (let i = 0; i < types.length && !found; i++)
        if (types[i] === prize.type)
          found = true;
      if (!found)
        types.push(prize.type)
      return types
    }, [])
  }

  render() {
    return (
      <Dialog
        title="Nuevo Premio"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}
        contentStyle={styles.dialog}
      >
        <TextField
          hintText="Ej: Artista X en sala X"
          errorText={this.state.newPrize.descriptionMessage}
          floatingLabelText="Descripción"
          value={this.state.newPrize.description || ''}
          onChange={this.updatePrizeDescrption.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <br />
        <AutoComplete
          hintText="Empieza a escribir"
          floatingLabelText="Tipo de Premio"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.prizeTypes.call(this)}
          searchText={this.state.newPrize.type}
          onUpdateInput={this.updatePrizeType.bind(this)}
        />
        {/* 
        <br />
        <SelectField
          floatingLabelText="Permisos"
          value={this.state.user.role}
          onChange={this.updateRole.bind(this)}
          errorText={this.state.user.roleMessage}
          disabled={(this.state.loggedUser && this.state.loggedUser.role === 'admin') ? false : true}
        >
          <MenuItem value={'user'} primaryText="Usuario" />
          <MenuItem value={'admin'} primaryText="Administrador" />
        </SelectField>
        <br />
        <TextField
          hintText="nombre@dominio.com.uy"
          errorText={this.state.user.emailMessage}
          floatingLabelText="Email"
          value={this.state.user.email || ''}
          onChange={this.updateEmail.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <br />
        <TextField
          hintText="Ingrese una contraseña"
          errorText={this.state.user.passwordMessage}
          floatingLabelText="Contraseña"
          value={this.state.user.password || ''}
          onChange={this.updatePasswordNew.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          type={this.state.showPasswords ? null : "password"}
        />
        <br />
        <TextField
          hintText="Repita la contraseña"
          errorText={this.state.user.passwordMatchMessage}
          floatingLabelText="Repetir Contraseña"
          value={this.state.user.passwordMatch || ''}
          onChange={this.updatePasswordMatch.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          type={this.state.showPasswords ? null : "password"}
        /> */}
        <br />
        <br />
        <br />
        <RaisedButton
          onClick={this.addPrize.bind(this)}
          label="Guardar"
          primary={true}
        />
        <FlatButton
          onClick={this.handleClose.bind(this)}
          label="Cancelar"
          style={{ marginLeft: '5px' }}
        />
        <pre>
          {JSON.stringify(this.state.newPrize, null, 2)}
        </pre>
      </Dialog>
    )
  }
}

export default AddPrizeForm;
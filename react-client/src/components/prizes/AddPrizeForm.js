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
import Toggle from 'material-ui/Toggle';

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
    newPrize.type = searchText
    newPrize.typeMessage = null
    this.setState({ newPrize })
  }
  updatePrizeSponsor(searchText) {
    const newPrize = this.state.newPrize
    newPrize.sponsor = searchText
    newPrize.sponsorMessage = null
    this.setState({ newPrize })
  }
  updatePrizePeriodic(evt, checked) {
    const newPrize = this.state.newPrize
    newPrize.periodic = checked
    newPrize.periodicMessage = null
    this.setState({ newPrize })
  }
  updatePrizeStock(e) {
    if(!this.state.newPrize.periodic){
      const newPrize = this.state.newPrize
      let stock = parseInt(e.target.value)
      else if(isNaN(stock)){
        newPrize.stock = null
        newPrize.stockMessage = 'Este campo solo acepta números enteros positivos'
      }
      else{
        newPrize.stock = stock
        newPrize.stockMessage = null
      }
    }
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
    if (!newPrize.type || newPrize.type === '')
      newPrize.typeMessage = 'Este campo es obligatorio'
    if (!newPrize.sponsor || newPrize.sponsor === '')
      newPrize.sponsorMessage = 'Este campo es obligatorio'
    if (newPrize.descriptionMessage || newPrize.typeMessage || newPrize.sponsorMessage)
      this.setState({ newPrize })
    else {
      delete newPrize.descriptionMessage
      delete newPrize.typeMessage
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

  sponsorsList() {
    return this.props.prizes.reduce((sponsors, prize) => {
      let found = false;
      for (let i = 0; i < sponsors.length && !found; i++)
        if (sponsors[i] === prize.sponsor)
          found = true;
      if (!found)
        sponsors.push(prize.sponsor)
      return sponsors
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
        autoScrollBodyContent={true}
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
          hintText="Buscar o Agregar"
          errorText={this.state.newPrize.typeMessage}
          floatingLabelText="Tipo de Premio"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.prizeTypes.call(this)}
          searchText={this.state.newPrize.type}
          onUpdateInput={this.updatePrizeType.bind(this)}
        />
        <br />
        <AutoComplete
          hintText="Buscar o Agregar"
          errorText={this.state.newPrize.sponsorMessage}
          floatingLabelText="Espónsor"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.sponsorsList.call(this)}
          searchText={this.state.newPrize.sponsor}
          onUpdateInput={this.updatePrizeSponsor.bind(this)}
        />
        <Toggle
          label="Este premio se entregará periódicamente"
          labelPosition="right"
          onToggle={this.updatePrizePeriodic.bind(this)}
          style={{ marginTop: '14px' }}
        />
        <TextField
          hintText="Ingrese un valor entero"
          errorText={this.state.newPrize.stockMessage}
          floatingLabelText="Stock"
          value={this.state.newPrize.stock || ''}
          onChange={this.updatePrizeStock.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          disabled={this.state.newPrize.periodic}
        />
        <br />
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
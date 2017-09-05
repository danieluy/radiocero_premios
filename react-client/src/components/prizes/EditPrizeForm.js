import React, { Component } from 'react';

import { editPrize } from '../../radiocero-api'
import session from '../../session'

import styles from '../../assets/styles'

import CustomDatePicker from '../custom-date-picker/CustomDatePicker'

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';
import Toggle from 'material-ui/Toggle';

class EditPrizeForm extends Component {
  constructor() {
    super()
    this.state = {
      prizeToEdit: {
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
        noteMessage: null
      },
      loggedUser: session.getLocalUser()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.prize) {
      const prizeToEdit = {
        type: nextProps.prize.type,
        typeMessage: null,
        sponsor: nextProps.prize.sponsor,
        sponsorMessage: null,
        description: nextProps.prize.description,
        descriptionMessage: null,
        stock: nextProps.prize.stock,
        stockMessage: null,
        periodic: nextProps.prize.periodic,
        periodicMessage: null,
        due_date: nextProps.prize.due_date,
        due_dateMessage: null,
        note: nextProps.prize.note,
        noteMessage: null
      }
      this.setState({ prizeToEdit })
    }
  }
  updatePrizeDescrption(e) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.description = e.target.value
    prizeToEdit.descriptionMessage = null
    this.setState({ prizeToEdit })
  }
  updatePrizeType(searchText) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.type = searchText
    prizeToEdit.typeMessage = null
    this.setState({ prizeToEdit })
  }
  updatePrizeSponsor(searchText) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.sponsor = searchText
    prizeToEdit.sponsorMessage = null
    this.setState({ prizeToEdit })
  }
  updatePrizePeriodic(evt, checked) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.periodic = checked
    prizeToEdit.periodicMessage = null
    this.setState({ prizeToEdit })
  }
  updatePrizeStock(e) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.stock = parseInt(e.target.value)
    prizeToEdit.stockMessage = null
    this.setState({ prizeToEdit })
  }
  updateNewPrize(field, value) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit[field] = value
    prizeToEdit[`${field}Message`] = null
    this.setState({ prizeToEdit })
  }
  updatePrizeDueDate(date) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.due_date = date
    prizeToEdit.due_dateMessage = null
    this.setState({ prizeToEdit })
  }
  updatePrizeNote(e) {
    const prizeToEdit = this.state.prizeToEdit
    prizeToEdit.note = e.target.value
    prizeToEdit.noteMessage = null
    this.setState({ prizeToEdit })
  }
  handleKeyPress(evt) {
    if (evt.key === 'Enter')
      this.editPrize()
  }
  editPrize() {
    const prizeToEdit = this.state.prizeToEdit
    if (!prizeToEdit.description || prizeToEdit.description === '')
      prizeToEdit.descriptionMessage = 'Este campo es obligatorio'
    if (!prizeToEdit.type || prizeToEdit.type === '')
      prizeToEdit.typeMessage = 'Este campo es obligatorio'
    if (!prizeToEdit.sponsor || prizeToEdit.sponsor === '')
      prizeToEdit.sponsorMessage = 'Este campo es obligatorio'
    if (!this.state.prizeToEdit.periodic) {
      let stock = parseInt(this.state.prizeToEdit.stock)
      if (isNaN(stock)) {
        prizeToEdit.stock = null
        prizeToEdit.stockMessage = 'Ingrese un número'
      }
      else if (stock < 1) {
        prizeToEdit.stock = null
        prizeToEdit.stockMessage = 'Mínimo: 1'
      }
    }
    else {
      prizeToEdit.stock = null
      prizeToEdit.stockMessage = null
    }
    if (prizeToEdit.note === '')
      prizeToEdit.note = null
    if (prizeToEdit.periodic !== true)
      prizeToEdit.periodic = false
    if (prizeToEdit.descriptionMessage || prizeToEdit.typeMessage || prizeToEdit.sponsorMessage || prizeToEdit.stockMessage)
      this.setState({ prizeToEdit })
    else {
      delete prizeToEdit.typeMessage
      delete prizeToEdit.sponsorMessage
      delete prizeToEdit.descriptionMessage
      delete prizeToEdit.stockMessage
      delete prizeToEdit.periodicMessage
      delete prizeToEdit.due_dateMessage
      delete prizeToEdit.noteMessage
      editPrize(prizeToEdit)
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
        title="Editar Premio"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose.bind(this)}
        contentStyle={styles.dialog}
        autoScrollBodyContent={true}
      >
        <TextField
          hintText="Ej: Artista X en sala X"
          errorText={this.state.prizeToEdit.descriptionMessage}
          floatingLabelText="Descripción"
          value={this.state.prizeToEdit.description || ''}
          onChange={this.updatePrizeDescrption.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          fullWidth={true}
        />
        <br />
        <AutoComplete
          hintText="Buscar o Agregar"
          errorText={this.state.prizeToEdit.typeMessage}
          floatingLabelText="Tipo de Premio"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.prizeTypes.call(this)}
          searchText={this.state.prizeToEdit.type}
          onUpdateInput={this.updatePrizeType.bind(this)}
          fullWidth={true}
        />
        <br />
        <AutoComplete
          hintText="Buscar o Agregar"
          errorText={this.state.prizeToEdit.sponsorMessage}
          floatingLabelText="Espónsor"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.sponsorsList.call(this)}
          searchText={this.state.prizeToEdit.sponsor}
          onUpdateInput={this.updatePrizeSponsor.bind(this)}
          fullWidth={true}
        />
        <br />
        <br />
        <Toggle
          label="Este premio se entregará periódicamente"
          labelPosition="right"
          toggled={this.state.prizeToEdit.periodic}
          onToggle={this.updatePrizePeriodic.bind(this)}
          style={{ marginTop: '14px' }}
        />
        <TextField
          hintText="Ingrese un número (>1)"
          errorText={this.state.prizeToEdit.stockMessage}
          floatingLabelText="Stock"
          value={this.state.prizeToEdit.stock || ''}
          onChange={this.updatePrizeStock.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          disabled={this.state.prizeToEdit.periodic}
          fullWidth={true}
        />
        <br />
        <br />
        <CustomDatePicker
          controlledDate={this.state.prizeToEdit.due_date}
          handleChange={this.updatePrizeDueDate.bind(this)}
          label="Vencimiento"
        />
        <TextField
          hintText="Ingrese comentarios sobre el premio"
          errorText={this.state.prizeToEdit.noteMessage}
          floatingLabelText="Notas"
          value={this.state.prizeToEdit.note || ''}
          onChange={this.updatePrizeNote.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          multiLine={true}
          rows={2}
          fullWidth={true}
        />
        <br />
        <br />
        <br />
        <RaisedButton
          onClick={this.editPrize.bind(this)}
          label="Guardar"
          primary={true}
        />
        <FlatButton
          onClick={this.handleClose.bind(this)}
          label="Cancelar"
          style={{ marginLeft: '5px' }}
        />
        <pre>
          {JSON.stringify(this.state.prizeToEdit, null, 2)}
        </pre>
      </Dialog>
    )
  }
}

export default EditPrizeForm;
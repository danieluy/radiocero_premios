import React, { Component } from 'react';

import DatePicker from 'material-ui/DatePicker';

import moment from 'moment';

class CustomDatePicker extends Component {
  constructor() {
    super()
    this.state = {}
  }
  handleChange(e, date) {
    this.props.handleChange(moment(date).format('YYYY/MM/DD'))
  }
  render() {
    const valueDate = this.props.controlledDate ? moment(this.props.controlledDate) : null
    const displayDate = this.props.controlledDate ? moment(this.props.controlledDate).locale('es').format("DD/MM/YYYY") : 'Vencimiento'
    return (
      <DatePicker
        hintText={displayDate}
        value={valueDate}
        onChange={this.handleChange.bind(this)}
        autoOk={true}
        DateTimeFormat={global.Intl.DateTimeFormat}
        locale="es"
      />
    )
  }
}

export default CustomDatePicker
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'material-ui/DatePicker';

import { CalendarIcon } from '../../assets/icons'

import moment from 'moment';

class CustomDatePicker extends Component {
  handleChange(e, date) {
    this.props.handleChange(moment(date).valueOf())
  }
  render() {
    const valueDate = this.props.controlledDate ? moment(this.props.controlledDate) : null
    const displayDate = this.props.controlledDate ? moment(this.props.controlledDate).locale('es').format("DD/MM/YYYY") : 'Vencimiento'
    return (
      <div>

        <label
          htmlFor="custom-date-picker"
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '72px'
          }}
        >
          <CalendarIcon width="30px" height="30px" fill="#888" />
          <span style={{ marginLeft: '10px' }}>
            {this.props.label}
            <strong style={{ marginLeft: '15px' }}>
              {valueDate ? moment(valueDate).format('DD/MM/YYYY') : ''}
            </strong>
          </span>
        </label>

        <DatePicker
          id="custom-date-picker"
          hintText={displayDate}
          value={valueDate}
          onChange={this.handleChange.bind(this)}
          autoOk={true}
          DateTimeFormat={global.Intl.DateTimeFormat}
          locale="es"
          style={{ display: 'none' }}
        />

      </div>
    )
  }
}

export default CustomDatePicker

CustomDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  controlledDate: PropTypes.number,
  handleChange: PropTypes.func.isRequired
};
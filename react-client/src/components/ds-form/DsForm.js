import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import TextField from 'material-ui/TextField';

class DsForm extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default DsForm;



export class InputText extends Component {
  constructor() {
    super()
    this.state = {
      value: null,
      valueMessage: null,
      isValid: false
    }
  }
  handleInput(evt) {
    const value = evt.target.value
    if (this.props.required) {
      if (!value || value === '') {
        this.setState({
          value: null,
          valueMessage: this.props.errorText
        })
      }
      else {
        this.setState({
          value,
          valueMessage: undefined
        })
        this.props.onChange(this.state.value)
      }
    }
    else {
      this.props.onChange(this.state.value)
    }
  }
  render() {
    return (
      <TextField
        floatingLabelText={this.props.floatingLabelText}
        hintText={this.props.hintText || this.props.floatingLabelText}
        errorText={this.state.valueMessage}
        value={this.state.value}
        onChange={this.handleInput.bind(this)}
        fullWidth={this.props.fullWidth}
      />
    )
  }
}
InputText.defaultProps = {
  floatingLabelText: PropTypes.string.isRequired,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  isValid: PropTypes.func
}
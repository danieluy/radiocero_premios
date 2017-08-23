import React, { Component } from 'react';

import Snackbar from 'material-ui/Snackbar';

class QuickNotice extends Component {

  constructor() {
    super()
    this.state = {
      open: false,
      message: '',
      autoHideDuration: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message && nextProps.message !== this.state.message)
      this.setState({
        open: true,
        message: nextProps.message
      })
  }

  handleRequestClose() {
    this.setState({
      open: false,
      message: ''
    });
  };

  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={this.state.autoHideDuration}
        onRequestClose={this.handleRequestClose.bind(this)}
      />
    );
  }
}

export default QuickNotice;